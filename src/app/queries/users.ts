import gql from 'graphql-tag';

export const queryUser = gql`
  query getUser($id: ID!) {
    user(id: $id) {
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

export const updateUser = gql`  
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      description
      displayName
      photoURL
      postCount
      updatedAt
      uid
    }
  }
`;
