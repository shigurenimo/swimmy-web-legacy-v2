import gql from 'graphql-tag';

export const mutationUpdatePostTag = gql`
  mutation updatePostTag($input: UpdatePostTagInput!) {
    updatePostTag(input: $input) {
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
