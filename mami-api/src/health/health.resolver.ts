export const resolvers = {
  Query: {
    healthCheck: () => {
      return "Server is up and running!";
    },
  },
  Mutation: {},
};
