import gql from 'graphql-tag';

export const postsQuery = gql`
  query {
    posts {
      nodes {
        __typename
        content
        createdAt
        id
        owner {
          displayName
          photoURL
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
          name
          count
        }
      }
    }
  }
`;
