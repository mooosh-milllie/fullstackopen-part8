import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      author
      born
      bookCount
    }
  }
`;

export const BOOK_INFO = gql`
fragment BookDetails on Book {
    title
    published
    author
    id
}
`;

export const BOOK_DETAILS = gql`
query {
  allBooks {
    ...BookDetails
  }
}${BOOK_INFO}
`;

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
      ) {
      title
      published
      author
      genres
      id
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password,
      ) {
      value
    }
  }
`;
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }  ${BOOK_INFO}
`;