const updatePostTag = require('../methods/updatePostTag').default;
const failureLog = require('../helpers/failureLog').default;

exports.default = (root, args, context) => {
  console.log('mutation: updatePostTag');

  args.name = args.name || 'スキ';

  if (!context.user) return;

  return updatePostTag(args, context.user).
    catch((err) => {
      return failureLog(err);
    });
};
