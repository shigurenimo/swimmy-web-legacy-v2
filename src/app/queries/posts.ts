import gql from 'graphql-tag';

export const postsQuery = gql`
  query {
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
        photoURL {
          x512
        }
        photoURLs {
          x512
        }
        repliedPostIds
        replyPostIds
        tags {
          id
          name
          count
        }
      }
    }
  }
`;
