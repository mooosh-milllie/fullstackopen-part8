import { useEffect, useState } from 'react'
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import { useApolloClient, useSubscription } from '@apollo/client';
import { BOOK_ADDED, BOOK_DETAILS } from './service/queries';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import styled from 'styled-components';
import BookSearch from './components/BookSearch';

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100%;
`;
const LogoCont = styled.div`
  flex: 1;
`;
const Logo = styled.h1`
  margin-left: 10%;
  font-size: 20px;
`;
const NavlinksCont = styled.nav`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;
const NaviLink = styled.span`
  padding: 3px;
  margin-right: 12%;
  color: black;
  font-size: 17px;
  text-decoration: none;
  text-transform: uppercase;
`;




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
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const navigate = useNavigate();
  useEffect(() => {
    const data = localStorage.getItem('library-user-token');
  
    setToken(data);
  }, [])
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/');
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
      <NavBar>
        <LogoCont><Logo>Know Books</Logo></LogoCont>
        <NavlinksCont>
          <NaviLink><Link className='a' to={'/'}>authors</Link></NaviLink>
          <NaviLink><Link className='a' to={'/books'}>books</Link></NaviLink>
          <NaviLink><Link className='a' to={'/addbook'} style={{ display: token ?  "block" : "none" }}>add book</Link></NaviLink>
          <NaviLink><Link className='a' to={'/login'} style={{ display: token ?  "none" : "block" }}>login</Link></NaviLink>
          <NaviLink onClick={() => logout()} style={{ display: token ?  "block" : "none" }}>Logout</NaviLink>
        </NavlinksCont>
      </NavBar>
      <Routes>
        <Route path='/' element={<Authors  />}/>
        <Route path='/books' element={<Books  />}/>
        <Route path='/addbook' element={<NewBook  />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login setToken={setToken} />}/>
        <Route path='/searchbook' element={<BookSearch />}/>

      </Routes>
    
    </div>
  )
}

export default App
