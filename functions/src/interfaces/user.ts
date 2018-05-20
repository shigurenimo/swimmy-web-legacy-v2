import { PhotoURLs } from '../types/photoURL';

export interface UserLink {
  id: string
  type: string
  name: string
}

export interface User {
  id?: string
  comment?: string;
  createdAt: Date
  description: string
  displayName: string
  followeeCount: number
  followerCount: number
  headerPhotoURL: string
  links: UserLink[]
  photoURL: string
  photoURLs: PhotoURLs
  postCount: number
  updatedAt: Date
  username: string
  uid: string
}

export interface UserForUpdate {
  displayName?: string;
  updatedAt: string;
}

export interface UserObject extends User {
  objectID: string;
}
