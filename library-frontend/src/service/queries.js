import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query Authors($limit: Int!, $cursor: String) {
    authors(limit: $limit, cursor: $cursor) {
      cursor
      hasMorePages
      author {
        id
        name
        born
        books {
          title
          published
          genres
          id
        }
      }
    }
  }
`;
export const SEARCH_BOOKS = gql`
  query Books($genre: String, $author: String, $cursor: String) {
    booksSearch(genre: $genre, author: $author, cursor: $cursor) {
      cursor
      book {
        title
        published
        author {
          name
        }
      }
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
  query Books($page: Int!, $limit: Int!) {
    books(page: $page, limit: $limit) {
      hasMorePages
      books {
        title
        published
        author {
          id
          name
        }
        genres
        id
      }
    }
  }  
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
export const REGISTER = gql`
  mutation register($username: String!, $password: String!, $favoriteGenre: String!) {
    createUser(username: $username, password: $password, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
      id
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