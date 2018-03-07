export interface Owner {
  displayName: string;
  photoURL: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface Post {
  aud: string;
  channelId: string;
  content: string;
  createdAt: string;
  id: string;
  photoURLs: string[];
  ownerId: string;
  owner: Owner;
  repliedPostIds: string[];
  replyPostIds: string[];
  tags: Tag[];
  updatedAt: string;
}

export interface PostNodes {
  nodes: [Post];
}

export interface PostsResult {
  posts: PostNodes;
}
