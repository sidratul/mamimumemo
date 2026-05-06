import { gql } from '@apollo/client';

export const DAYCARE_FIELDS = gql`
  fragment DaycareFields on Daycare {
    _id
    name
    logoUrl
    city
    address
    description
    submittedAt
    approvedAt
    isActive
    owner {
      _id
      name
      email
      phone
    }
    legalDocuments {
      type
      url
      verified
    }
    approval {
      status
      note
      history {
        status
        note
        changedAt
        changedBy {
          name
        }
      }
    }
  }
`;
