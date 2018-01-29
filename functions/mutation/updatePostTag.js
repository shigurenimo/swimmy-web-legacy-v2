const {updatePostTag} = require('../https/updatePostTags');

exports.default = (root, args, context) => {
  args.name = args.name || 'like';
  if (!context.uid) return;
  return updatePostTag(args, context);
};
