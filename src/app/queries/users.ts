import gql from 'graphql-tag';

export const queryUser = gql`
  query getUser($id: ID, $username: String) {
    user(id: $id, username: $username) {
      createdAt
      description
      displayName
      followeeCount
      followerCount
      headerPhotoURL
      id
      links {
        id
        type
        name
      }
      photoURL
      postCount
      updatedAt
      uid
    }
  }
`;
