export const typeDefs = `
  type Menu {
    id: ObjectId!
    daycareId: ObjectId!
    date: Date!
    meals: [Meal!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type Meal {
    type: MealType!
    menu: String!
    ingredients: [String!]!
    allergens: [String!]!
    notes: String
  }

  enum MealType {
    BREAKFAST
    SNACK
    LUNCH
    DINNER
  }

  input MealInput {
    type: MealType!
    menu: String!
    ingredients: [String!]
    allergens: [String!]
    notes: String
  }

  input CreateMenuInput {
    daycareId: ObjectId!
    date: Date!
    meals: [MealInput!]!
  }

  input UpdateMenuInput {
    meals: [MealInput!]
  }

  extend type Query {
    "Get menu for a specific date"
    menu(daycareId: ObjectId!, date: Date!): Menu
    
    "Get menus for a date range"
    menus(daycareId: ObjectId!, startDate: Date!, endDate: Date!): [Menu!]!
    
    "Get today's menu"
    todayMenu(daycareId: ObjectId!): Menu
  }

  extend type Mutation {
    "Create or update menu for a date"
    createMenu(input: CreateMenuInput!): Menu!
    
    "Update menu"
    updateMenu(id: ObjectId!, input: UpdateMenuInput!): Menu!
    
    "Delete menu"
    deleteMenu(id: ObjectId!): Boolean!
  }
`;
