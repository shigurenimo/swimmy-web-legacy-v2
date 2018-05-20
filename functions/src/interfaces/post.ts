import { PhotoURLs } from '../types/photoURL';
import { Tags } from '../types/tag';
import { Owner } from './owner';

export interface Post {
  id: string;
  content: string
  createdAt: Date | number;
  ownerId?: string;
  owner?: Owner;
  photoCount?: number;
  photoURL: string;
  photoURLs: PhotoURLs;
  repliedPostCount: number;
  repliedPostIds: string[];
  replyPostId: string;
  tags: Tags;
  updatedAt: Date | number;
}

export interface PostObject extends Post {
  objectID: string;
}
