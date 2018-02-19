import {getPosts} from '../api/posts/getPosts';

export default () => {
  console.log('query: posts');

  return getPosts({limit: 40}).
    then((nodes) => {
      const sortedNodes = nodes.sort((a, b) => b.createdAt - a.createdAt);
      return {nodes: sortedNodes};
    });
};
