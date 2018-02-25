import cors from 'cors'

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { readFile } from 'fs'
import { join } from 'path'
import { USERS } from '../constants/index'

import { failureResponse } from '../helpers/failureResponse'
import { successResponse } from '../helpers/successResponse'

const batchLimit = 450 // < 500
const limit = 400
const merge = false

export default functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    return readData().then((data) => {
      const tasks = toTasks(data)
      return Promise.all([
        createAuthentication(data),
        updateUsers(tasks)
      ])
    }).then(() => {
      return successResponse(response)
    }).catch((err) => {
      return failureResponse(response, err)
    })
  })
})

const readData = () => {
  const inputUserFile = join(__dirname, '..', 'exports', 'users.json')

  return new Promise((resolve, reject) => {
    return readFile(inputUserFile, 'utf-8', (err, res) => {
      if (err) { throw err }
      const users = res.split('\n')
        .filter((line) => {
          return line
        })
        .map((line) => {
          return JSON.parse(line)
        })
        .map((res) => {
          return {
            bycript: res.services.password.bcrypt,
            code: res.profile.code,
            createdAt: res.createdAt.$date,
            email: `${res.username}@swimmy.io`,
            displayName: res.profile.name,
            updatedAt: res.createdAt.$date,
            username: res.username,
            uid: res._id
          }
        })

      resolve(users)
    })
  })
}

const createAuthentication = (data) => {
  const promises = data.filter((res, index) => index < limit).map((user) => {
    return admin.auth().createUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      disabled: true
    }).catch(() => {
    })
  })

  return Promise.all(promises)
}

const updateUsers = (tasks) => {
  const firestore = admin.firestore()

  const batches = tasks.map((users) => {
    const batch = firestore.batch()

    users.forEach((user) => {
      const ref = firestore.collection(USERS).doc(user.uid)
      batch.set(ref, user, {merge: merge})
    })

    return batch.commit()
  })

  return Promise.all(batches)
}

const toTasks = (docs) => {
  const tasks = []

  docs.forEach((post, index) => {
    if (index > limit) {
      return
    }

    const batchIndex = Math.ceil((index + 1) / batchLimit) - 1

    if (!tasks[batchIndex]) {
      tasks[batchIndex] = []
    }

    tasks[batchIndex].push(post)
  })

  return tasks
}
