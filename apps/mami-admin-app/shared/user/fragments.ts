import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    _id
    name
    email
    phone
    role
    accesses
    createdAt
    updatedAt
  }
`;
