import React, { useState } from 'react'
import BookSearchForm from './BookSearchForm';
import * as yup from 'yup';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { Formik } from 'formik';
import { SEARCH_BOOKS } from '../service/queries';

const Container = styled.div``;
const InfoContainer = styled.div``;

const validationSchema = yup.object().shape({
  author: yup
  .string(),
  genre: yup
  .string()
  
});
const initialValues = {
  author: '',
  genre: '',
}
const BookSearch = () => {
  // const [author, setAuthor] = useState();
  // const [genre, setGenre] = useState();
  const [searchedbook, setSearchedBook] = useState()

  const {data, loading, refetch, fetchMore} = useQuery(SEARCH_BOOKS, {
    skip: true
  })
  console.log(data)
  console.log(loading)
 
  const onSubmit = async(values) => {
    const {author, genre} = values;
    console.log(author, genre)
    const {data} = await refetch({
      author: author,
      genre: genre
    })
    console.log(data)
    setSearchedBook(data);
  }
  return (
    <div>
      <div>
        <h1> Book Search</h1>
      </div>
      <div>
      <Container>
        <div>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ handleSubmit }) => <BookSearchForm onSubmit={handleSubmit} />}
          </Formik>
          <InfoContainer>
            <p>Saerch by either Author's name or Book's Genre, or both</p>
          </InfoContainer>
        </div>
      </Container>
      <div>
        {(searchedbook === undefined) ? null : (<div>
          {
            searchedbook.booksSearch.book.map(book => {
              return (
                <div>
                  <div>
                    <h4>{book.author[0].name}</h4>
                    <h5>{book.title}</h5>
                    <h5>{book.published}</h5>
                  </div>
                  
                </div>
              )})
          }
        </div>) }
        <button onClick={ async() => {
          const {data} = await fetchMore({
            cursor: searchedbook.booksSearch.cursor,
          })
          console.log("button:::", data);
        }
          
        }>
        Load more
        </button>
        
      </div>
      </div>
    </div>
  )
}

export default BookSearch;
