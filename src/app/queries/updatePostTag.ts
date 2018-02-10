import gql from 'graphql-tag';

export const mutationUpdatePostTag = gql`
  mutation updatePostTag($input: UpdatePostTagInput!) {
    updatePostTag(input: $input) {
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
