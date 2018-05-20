import { setImage } from '../../api/images/setImage';
import { getPhotoURL } from '../../api/microservices/getPhotoURL';
import { setPostAsAnonymous } from '../../api/posts-as -anonymous/setPostAsAnonymous';
import { deletePost } from '../../api/posts/deletePost';
import { getPost } from '../../api/posts/getPost';
import { setPost } from '../../api/posts/setPost';
import { updatePostTag } from '../../api/posts/updatePostTag';
import { updateUser } from '../../api/users/updateUser';
import { createPost } from '../../models/posts/createPost';
import { createPostAsAnonymous } from '../../models/posts/createPostAsAnonymous';
import { createPostObject } from '../../models/posts/createPostObject';
import { createUpdateUser } from '../../models/users/createUpdateUser';
import { checkOwner } from '../../utils/checkOwner';
import { createId } from '../../utils/createId';

export const Mutation = {
  async addPost (root, { input }, context) {
    const owner = context.user;

    const postId = createId();

    const photoURLs = {};

    for (let i = 0; i < input.photoURLs.length; ++i) {
      const { photoId, photoURL: downloadURL } = input.photoURLs[i];
      const photoURL = await getPhotoURL('posts', photoId, downloadURL);
      photoURLs[photoId] = photoURL;
      await setImage(photoId, photoURL);
    }

    input.photoURL = Object.keys(photoURLs).length ? photoURLs[0].photoURL : null;

    const newPost = await createPost(postId, input, owner);
    const newPostAsAnonymous = createPostAsAnonymous(newPost);

    await setPostAsAnonymous(postId, newPostAsAnonymous);
    await setPost(postId, newPost);

    return createPostObject(postId, newPost);
  },
  hello (root, args, context) {
    return 'hello';
  },
  async updatePostTag (root, args, context) {
    args.name = args.name || 'スキ';

    if (!context.user) {
      throw new Error('context.user not found');
    }

    const input = args.input;

    await updatePostTag(input, context.user);
  },
  async updateUser (root, { id, input }, { user }) {
    if (!user) {
      throw new Error('context.user not found');
    }

    if (id !== user.uid) {
      throw new Error('not authenticated');
    }

    const photoURLs = {};

    for (let i = 0; i < input.photoURLs.length; ++i) {
      const { photoId, photoURL: downloadURL } = input.photoURLs[i];
      const photoURL = await getPhotoURL('posts', photoId, downloadURL);
      photoURLs[photoId] = photoURL;
      await setImage(photoId, photoURL);
    }

    input.photoURL = Object.keys(photoURLs).length ? photoURLs[0].photoURL : null;

    const newUser = await createUpdateUser(user.uid, input);

    await updateUser(id, newUser);

    return newUser;
  },
  async deletePost (root, { id: postId }, { user }) {
    const post = await getPost(postId);

    checkOwner(post, user);

    await deletePost(postId);

    return postId;
  }
};
