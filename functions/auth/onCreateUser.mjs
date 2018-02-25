import * as functions from 'firebase-functions'

import { failureLog } from '../helpers/failureLog'
import { updateAuthDisplayName } from '../api/authentications/updateAuthDisplayName'
import { setUser } from '../api/users/setUser'

export default functions.auth.user().onCreate((event) => {
  const user = event.data

  if (user.disabled) {
    console.log('user.disabled')
    return Promise.resolve()
  }

  return Promise.all([
    updateAuthDisplayName(user.uid, user),
    setUser(user.uid, user)
  ]).catch((err) => {
    return failureLog(err)
  })
})
