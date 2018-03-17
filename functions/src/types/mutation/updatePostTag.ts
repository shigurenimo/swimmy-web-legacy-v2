import { updatePostTag } from '../../api/posts/updatePostTag'

import { failureLog } from '../../helpers/failureLog'

export default (root, args, context) => {
  console.log('mutation: updatePostTag')

  args.name = args.name || 'スキ'

  if (!context.user) {
    throw new Error('context.user not found')
  }

  const input = args.input

  return updatePostTag(input, context.user).catch((err) => {
    return failureLog(err)
  })
};
