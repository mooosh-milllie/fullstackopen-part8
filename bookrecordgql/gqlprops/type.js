const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }
  type Author {
    author: String!
    born: String
    bookCount: Int!
  }
  type AuthorBooks {
    title: String!
    author: String!
  }
  type Authors {
    name: String!
    born: Int
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorsCount: Int!
    allBooks: [Book!]!
    allAuthors: [Author!]!
    allAuthorBooks(author: String, genre: String): [AuthorBooks]!
    me: User
  }
  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token

    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      born: Int!
    ): Authors
  }

  type Subscription {
    bookAdded: Book!
  }
`;

module.exports = typeDefs;