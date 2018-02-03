const getTag = require('../methods/getTag').default;
const updatePostTag = require('../methods/updatePostTag').default;
const failureLog = require('../helpers/failureLog').default;

exports.default = (root, args, context) => {
  console.log('mutation: updatePostTag');

  args.name = args.name || 'like';

  if (!context.user) return;

  return updatePostTag(args, context.user).
    then((tag) => {
      console.log('tag', tag);
      return tag;
    }).
    catch((err) => {
      return failureLog(err);
    });
};
