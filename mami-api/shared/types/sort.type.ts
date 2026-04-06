export const sortTypeDef = `
  enum SortType {
    ASC
    DESC
  }

  input SortInput {
    sortBy: String
    sortType: SortType
  }
`;

export interface SortInput {
  sortBy?: string;
  sortType?: "ASC" | "DESC";
}

export interface SortOptions {
  sort?: SortInput;
}

