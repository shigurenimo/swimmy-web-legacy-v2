import { setImage } from '../../api/images/setImage';
import { getPhotoURL } from '../../api/microservices/getPhotoURL';
import { setPostAsAnonymous } from '../../api/posts-as -anonymous/setPostAsAnonymous';
import { deletePost } from '../../api/posts/deletePost';
import { getPost } from '../../api/posts/getPost';
import { setPost } from '../../api/posts/setPost';
import { updatePostTag } from '../../api/posts/updatePostTag';
import { updateUser } from '../../api/users/updateUser';
import { Context } from '../../interfaces/graphql';
import { AddPostArgs, DeletePostArgs, UpdatePostTagArgs, UpdateUserArgs } from '../../interfaces/mutation';
import { createPost } from '../../models/posts/createPost';
import { createPostAsAnonymous } from '../../models/posts/createPostAsAnonymous';
import { createPostObject } from '../../models/posts/createPostObject';
import { createUpdateUser } from '../../models/users/createUpdateUser';
import { checkOwner } from '../../utils/checkOwner';
import { createId } from '../../utils/createId';

export const Mutation = {
  async addPost(root, { input }: AddPostArgs, { user }: Context) {
    const owner = user;

    const postId = createId();

    const photoURLs = {};

    for (const photo of input.photos) {
      const { photoId, downloadURL } = photo;
      const photoObject = await getPhotoURL('posts', photoId, downloadURL);
      photoURLs[photoId] = photoObject;
      await setImage(photoId, photoObject);
    }

    const photoIds = Object.keys(photoURLs) || [];

    const photoURL = photoIds.length ? photoURLs[photoIds[0]].photoURL : null;

    const createPostInput = {
      ...input,
      photoURLs,
      photoURL,
    };

    const newPost = await createPost(postId, createPostInput, owner);
    const newPostAsAnonymous = createPostAsAnonymous(newPost);

    await setPostAsAnonymous(postId, newPostAsAnonymous);
    await setPost(postId, newPost);

    return createPostObject(postId, newPost);
  },
  hello(root, args, context) {
    return 'hello';
  },
  async updatePostTag(root, { input }: UpdatePostTagArgs, { user }: Context) {
    if (!user) {
      throw new Error('context.user not found');
    }

    await updatePostTag(input, user);
  },
  async updateUser(root, { id, input }: UpdateUserArgs, { user }: Context) {
    if (!user) {
      throw new Error('context.user not found');
    }

    if (id !== user.uid) {
      throw new Error('not authenticated');
    }

    const photoURLs = {};

    for (const photo of input.photos) {
      const { photoId, downloadURL } = photo;
      const photoObject = await getPhotoURL('posts', photoId, downloadURL);
      photoURLs[photoId] = photoObject;
      await setImage(photoId, photoObject);
    }

    const photoIds = Object.keys(photoURLs) || [];

    const photoURL = photoIds.length ? photoURLs[photoIds[0]].photoURL : null;

    const createUpdateUserInput = {
      ...input,
      photoURLs,
      photoURL,
    };

    const newUser = await createUpdateUser(createUpdateUserInput);

    await updateUser(id, newUser);

    return newUser;
  },
  async deletePost(root, { id: postId }: DeletePostArgs, { user }: Context) {
    const post = await getPost(postId);

    checkOwner(post, user);

    await deletePost(postId);

    return postId;
  },
};
