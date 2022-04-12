import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { LOGIN } from '../service/queries';

const Login = (props) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      // setError(error.graphQLErrors[0].message)
      console.log(error);
    }
  });

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      props.setToken(token);
      localStorage.setItem('library-user-token', token);
      props.setPage('authors');
    }
  }, [result.data]) // eslint-disable-line


  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div className='input-div'>
          <input 
            type={"text"}
            placeholder="username"
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div className='input-div'>
          <input 
            type={"text"}
            placeholder="password"
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login;