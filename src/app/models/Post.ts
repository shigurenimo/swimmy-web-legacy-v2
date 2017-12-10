class Image {
  name: string;
}

export class Post {
  aud: string;
  channelId: string;
  content: string;
  createdAt: string;
  id: string;
  images: Image[];
  ownerId: string;
  reactions: string[];
  replyId: string;
  updatedAt: string;
}
