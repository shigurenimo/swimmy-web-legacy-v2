import gql from 'graphql-tag';

export const postsQuery = gql`
  query {
    posts {
      nodes {
        id
        content
        tags {
          name
          count
        }
      }
    }
  }
`;
