class Image {
  name: string;
}

class Owner {
  name: string;
}

export class Post {
  aud: string;
  channelId: string;
  content: string;
  createdAt: string;
  id: string;
  images: Image[];
  owner: Owner;
  ownerId: string;
  repliedPostIds: string[];
  replyPostIds: string[];
  tags: string[];
  updatedAt: string;
}

class Nodes {
  nodes: Post;
}

export class PostsResult {
  posts: Nodes;
}
