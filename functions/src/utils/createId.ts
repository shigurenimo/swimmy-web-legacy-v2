import { firestore } from 'firebase-admin/lib/index';

export const createId = (): string => {
  return firestore().collection('new').doc().id;
};
