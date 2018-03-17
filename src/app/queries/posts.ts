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
        updatedAt
      }
    }
  }
`;

export const queryThreadPosts = gql`
  query posts($query: String) {
    posts(type: THREAD, limit: 20, query: $query) {
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
        updatedAt
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
        updatedAt
      }
    }
  }
`;

export const queryRepliedPosts = gql`
  query posts($replyPostId: ID) {
    posts(type: REPLY, limit: 40, replyPostId: $replyPostId) {
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
        updatedAt
      }
    }
  }
`;

export const queryPost = gql`
  query post($id: ID!) {
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
      updatedAt
    }
  }
`;
