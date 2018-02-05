import gql from 'graphql-tag';

export const queryPosts = gql`
  query getPosts {
    posts {
      nodes {
        id
        content
        createdAt
        owner {
          id
          displayName
          photoURL
          uid
        }
        photoURLs {
          x512
        }
        repliedPostCount
        replyPostId
        tags {
          id
          name
          count
        }
      }
    }
  }
`;

export const mutationAddPost = gql`
  mutation addPost($input: AddPostInput!) {
    addPost(input: $input) {
      id
      content
      createdAt
      owner {
        id
        displayName
        photoURL
        uid
      }
      photoURLs {
        x512
      }
      repliedPostCount
      replyPostId
      tags {
        id
        name
        count
      }
    }
  }
`
