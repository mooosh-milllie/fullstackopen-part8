import { useEffect, useState } from 'react'
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import { useApolloClient, useSubscription } from '@apollo/client';
import { BOOK_ADDED, BOOK_DETAILS } from './service/queries';


export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k)
    })
  }  
  cache.updateQuery(query, ({ allBooks }) => {
    console.log(addedBook);
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}
const App = () => {
  const [page, setPage] = useState('authors'); 
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  useEffect(() => {
    const data = localStorage.getItem('library-user-token');
  
    setToken(data);
  }, [])
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      updateCache(client.cache, { query: BOOK_DETAILS },addedBook)
      // client.cache.updateQuery({ 
      //   query: BOOK_DETAILS }, ({ allBooks }) => {
      //     console.log(addedBook);
      //     return { 
      //       allBooks: allBooks.concat(addedBook),
      //     }
      //   })
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button style={{ display: token ?  "block" : "none" }} onClick={() => setPage('add')}>add book</button>
        <button style={{ display: token ?  "none" : "block" }} onClick={() => setPage('login')}>login</button>
        <button style={{ display: token ?  "block" : "none" }} onClick={() => {
          logout()
          setPage('authors');
        }}>logout</button>
      </div>
      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App
