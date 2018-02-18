import {addPost} from '../api/posts/addPost';

import {failureLog} from '../helpers/failureLog';

export default (root, args, context) => {
  console.log('mutation: addPost');

  if (!context.user) {
    throw new Error('context.user not found');
  }

  return addPost(args.input, context.user).
    catch((err) => {
      return failureLog(err);
    });
};
