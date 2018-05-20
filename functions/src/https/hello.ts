import { https } from 'firebase-functions';

export = https.onCall((data, context) => {
  console.log(data, context);
});
