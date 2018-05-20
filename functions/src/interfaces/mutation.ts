export interface PhotoInput {
  downloadURL: string
  photoId: string
}

export interface AddPostInput {
  content: string
  photos: PhotoInput[]
  replyPostId: string
}

export interface AddPostArgs {
  input: AddPostInput
}

export interface UpdateUserInput {
  description: string
  displayName: string
  photos: PhotoInput[]
  username: string
}

export interface UpdateUserArgs {
  id: string;
  input: UpdateUserInput
}

export interface DeletePostArgs {
  id: string
}

export interface UpdatePostTagInput {
  postId: string
  name: string
}

export interface UpdatePostTagArgs {
  input: UpdatePostTagInput
}
