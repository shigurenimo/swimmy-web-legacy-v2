import { Photo } from './input';

export interface AddPostInput {
  content: string,
  photos: Photo[],
  replyPostId: string | null
}
