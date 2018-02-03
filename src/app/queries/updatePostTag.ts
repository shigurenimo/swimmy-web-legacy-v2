import gql from 'graphql-tag';

export const updatePostTag = gql`
  mutation updatePostTag($id: String!, $name: String) {
    updatePostTag(id: $id, name: $name) {
      id
      name
      count
    }
  }
`;
