import gql from 'graphql-tag';

export const queryPosts = gql`
  query posts {
    posts(limit: 40) {
      nodes {
        id
        content
        createdAt
        ownerId
        owner {
          id
          displayName
          photoURL
        }
        photoURLs
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

export const queryThreadPosts = gql`
  query posts {
    posts(type: THREAD) {
      nodes {
        id
        content
        createdAt
        ownerId
        owner {
          id
          displayName
          photoURL
        }
        photoURLs
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

export const queryPhotoPosts = gql`
  query posts {
    posts(type: PHOTO) {
      nodes {
        id
        content
        createdAt
        ownerId
        owner {
          id
          displayName
          photoURL
        }
        photoURLs
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
      ownerId
      owner {
        id
        displayName
        photoURL
      }
      photoURLs
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
      ownerId
      owner {
        id
        displayName
        photoURL
      }
      photoURLs
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
