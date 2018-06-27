import { https } from 'firebase-functions';

import { Owner } from '../interfaces/owner';

export = https.onCall((data, context) => {
  const owner: Owner = 'auth' in context ? {
    uid: context.auth.uid,
    displayName: context.auth.token.name,
    photoURL: context.auth.token.picture,
  } : null;

  console.log(owner);

  return { owner };
});
