import fs from 'fs'

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

fs.readFile('./service-accounts.json', 'utf-8', (err, data) => {
  if (err) {
    admin.initializeApp(functions.config().firebase)
    return
  }
  try {
    const {projectId} = functions.config().firebase
    const serviceAccounts = JSON.parse(data)
    const serviceAccount = serviceAccounts[projectId]
    const credential = admin.credential.cert(serviceAccount)
    admin.initializeApp({credential})
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
})

const FUNCTION_NAME = process.env.FUNCTION_NAME

// auth

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreateUser') {
  exports.onCreateUser = require('./auth/onCreateUser').default
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeleteUser') {
  exports.onDeleteUser = require('./auth/onDeleteUser').default
}

// firestore

if (!FUNCTION_NAME || FUNCTION_NAME === 'onCreatePost') {
  exports.onCreatePost = require('./firestore/onCreatePost').default
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'onDeletePost') {
  exports.onDeletePost = require('./firestore/onDeletePost').default
}

// https

if (!FUNCTION_NAME || FUNCTION_NAME === 'graphql') {
  exports.graphql = require('./https/graphql').default
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'importUsers') {
  exports.importUsers = require('./https/importUsers').default
}

if (!FUNCTION_NAME || FUNCTION_NAME === 'importPosts') {
  exports.importPosts = require('./https/importPosts').default
}
