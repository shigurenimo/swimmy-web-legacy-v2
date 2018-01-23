import gql from 'graphql-tag';

export const postsQuery = gql`
  query {
    posts {
      nodes {
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
        plus {
          name
          count
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
