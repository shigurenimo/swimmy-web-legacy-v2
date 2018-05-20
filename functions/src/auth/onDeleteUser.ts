import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

const document = functions.auth.user();

export = document.onDelete(async (user: UserRecord) => {
  console.info(`delete ${user.displayName}`);

  return 200;
})
