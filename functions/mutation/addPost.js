const addPost = require('../methods/addPost').default;
const failureLog = require('../helpers/failureLog').default;

exports.default = (root, args, context) => {
  console.log('mutation: addPost');

  if (!context.user) {
    throw new Error('user not found');
  }

  return addPost(args.input, context.user).
    catch((err) => {
      return failureLog(err);
    });
};
