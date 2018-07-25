import { Owner } from '../../interfaces/owner';
import { Post } from '../../interfaces/post';
import { PhotoURLs } from '../../types/photoURL';

interface Input {
  content: string;
  replyPostId: string;
  photoURL: string;
  photoURLs: PhotoURLs
}

export const createPost = async (
  postId: string,
  input: Input,
  owner: Owner | null,
): Promise<Post> => {
  const createdAt = new Date();

  return {
    id: postId,
    content: input.content,
    createdAt: createdAt,
    ownerId: owner ? owner.uid : null,
    owner: null,
    repliedPostCount: 0,
    replyPostId: input.replyPostId || null,
    repliedPostIds: [],
    tags: {},
    photoURL: input.photoURL,
    photoURLs: input.photoURLs,
    updatedAt: createdAt,
  };
};
