import { addPost } from '../../api/posts/addPost';

export default async (root, {input}, context) => {
  console.log('mutation: addPost');

  const newPost = await addPost(input, context.user);

  return newPost;
};
