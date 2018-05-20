import { Photo } from './input';

export interface AddPostInput {
  content: string
  photos: Photo[]
  replyPostId: string | null
}

export interface UpdateUserInput {
  description?: string
  displayName?: string
  photos?: Photo[]
  username?: string
}

export interface UpdatePostTagInput {
  postId: string
  name: string
}
