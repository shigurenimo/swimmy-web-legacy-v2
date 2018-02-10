const updatePostTag = require('../methods/updatePostTag').default;
const failureLog = require('../helpers/failureLog').default;

exports.default = (root, args, context) => {
  console.log('mutation: updatePostTag');

  args.name = args.name || 'スキ';

  if (!context.user) {
    throw new Error('user not found');
  }

  const input = args.input;

  return updatePostTag(input, context.user).
    catch((err) => {
      return failureLog(err);
    });
};
