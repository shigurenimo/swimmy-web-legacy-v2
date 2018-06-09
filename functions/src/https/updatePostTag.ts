import { https } from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';

import { updatePostTag } from '../api/posts/updatePostTag';
import { Owner } from '../interfaces/owner';

interface Data {
  postId: string;
  name: string;
}

export = https.onCall(async (data: Data, context: CallableContext) => {
  const owner: Owner = 'auth' in context ? {
    uid: context.auth.uid,
    displayName: context.auth.token.name,
    photoURL: context.auth.token.picture,
  } : null;

  if (!owner) {
    throw new Error('not authenticated');
  }

  const updatePostTagInput = {
    postId: data.postId,
    name: data.name,
  };

  await updatePostTag(updatePostTagInput, owner);

  return {};
});
