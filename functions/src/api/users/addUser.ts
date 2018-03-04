import { setUser } from './setUser'

/**
 * Set User to users/{uid}
 * @param {Object} user
 */
export const addUser = (user) => {
  if (!user) {
    throw new Error('user not found')
  }

  const uid = user.uid

  const input = {
    displayName: user.email.match(/^[^@]+/)[0]
  }

  return setUser(uid, input)
}
