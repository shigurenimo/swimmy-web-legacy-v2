import gql from 'graphql-tag';

export const updatePostTag = gql`
  mutation updatePostTag($id: String!, $name: String) {
    updatePostTag(id: $id, name: $name) {
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
`;
