const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.auth.user().onDelete((event) => {
  const user = event.data;

  console.info(`delete ${user.displayName}`);

  return;
});
