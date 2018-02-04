class Image {
  name: string;
}

class Owner {
  name: string;
}

class Tag {
  name: string;
  count: number;
}

export class Post {
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

class Nodes {
  nodes: [Post];
}

export class PostsResult {
  posts: Nodes;
}
