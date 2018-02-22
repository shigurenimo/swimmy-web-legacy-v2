import * as functions from 'firebase-functions';

export default functions.auth.user().onDelete((event) => {
  const user = event.data;

  console.info(`delete ${user.displayName}`);

  return 200;
});
