export const typeDefs = `
  type Gallery {
    id: ObjectId!
    daycareId: ObjectId!
    childName: String
    photos: [String!]!
    caption: String
    date: Date!
    event: String
    uploadedBy: UploadedBy!
    createdAt: Date!
    updatedAt: Date!
  }

  type UploadedBy {
    userId: ObjectId!
    name: String!
  }

  input UploadedByInput {
    userId: ObjectId!
    name: String!
  }

  input CreateGalleryInput {
    daycareId: ObjectId!
    childName: String
    photos: [String!]!
    caption: String
    date: Date!
    event: String
  }

  input UpdateGalleryInput {
    photos: [String!]
    caption: String
    event: String
  }

  extend type Query {
    "Get gallery items for a daycare"
    gallery(daycareId: ObjectId!, childName: String, limit: Int): [Gallery!]!
    
    "Get gallery item by ID"
    galleryItem(id: ObjectId!): Gallery
    
    "Get general gallery (no specific child)"
    generalGallery(daycareId: ObjectId!): [Gallery!]!
    
    "Get child-specific gallery"
    childGallery(daycareId: ObjectId!, childName: String!): [Gallery!]!
  }

  extend type Mutation {
    "Create a new gallery item"
    createGallery(input: CreateGalleryInput!): Gallery!
    
    "Update gallery item"
    updateGallery(id: ObjectId!, input: UpdateGalleryInput!): Gallery!
    
    "Delete gallery item"
    deleteGallery(id: ObjectId!): Boolean!
  }
`;
