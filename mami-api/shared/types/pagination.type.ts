export const paginationTypeDef = `
  input PaginationInput {
    page: Int
    limit: Int
  }
`;

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

