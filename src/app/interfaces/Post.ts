export interface Image {
  name: string;
}

export interface Owner {
  name: string;
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
  images: Image[];
  owner: Owner;
  plus: Tag;
  repliedPostIds: string[];
  replyPostIds: string[];
  tags: Tag[];
  updatedAt: string;
}

export interface Nodes {
  nodes: [Post];
}

export interface PostsResult {
  posts: Nodes;
}
