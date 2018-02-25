import { addPost } from '../api/posts/addPost'

import { failureLog } from '../helpers/failureLog'

export default (root, args, context) => {
  console.log('mutation: addPost')

  return addPost(args.input, context.user).catch((err) => {
    return failureLog(err)
  })
};
