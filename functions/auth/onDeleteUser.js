import * as functions from 'firebase-functions';

exports.default = functions.auth.user().onDelete((event) => {
  const user = event.data;

  console.info(`delete ${user.displayName}`);

  return;
});
