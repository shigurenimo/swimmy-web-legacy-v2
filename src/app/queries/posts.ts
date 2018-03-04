import gql from 'graphql-tag';

export const queryPosts = gql`
  query posts {
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
          id
          photoURL
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

export const queryPost = gql`
  query post($id: ID) {
    post(id: $id) {
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
`;
