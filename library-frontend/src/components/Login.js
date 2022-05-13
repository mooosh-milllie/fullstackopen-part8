import { useMutation } from '@apollo/client';
import React from 'react';
import { LOGIN } from '../service/queries';
import * as yup from 'yup';
import LoginForm from './LoginForm';
import { Formik } from 'formik';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div``;
const InfoContainer = styled.div``;

const validationSchema = yup.object().shape({
  username: yup
  .string()
  .min(5, 'Username must be atleast 5 characters')
  .required('Username is required'),
  password: yup
  .string()
  .min(8, 'Password must be atleast 8 characters')
  .required('Password is required'),
});
const initialValues = {
  username: '',
  password: '',
}

const Login = (props) => {
  const navigate = useNavigate()
  const [ login ] = useMutation(LOGIN, {
    onError: (error) => {
      // setError(error.graphQLErrors[0].message)
      console.log(error);
    }
  });

  const onSubmit = async(values) => {
    const {username, password} = values;
    const {data} = await login({ variables: { username, password } });
    if (data) {
      console.log("Data from onSubmit: ", data);
      const token = data.login.value
      props.setToken(token);
      localStorage.setItem('library-user-token', token);
      navigate('/');
    }
  }
  return (
    <Container>
      <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ handleSubmit }) => <LoginForm onSubmit={handleSubmit} />}
      </Formik>
      <InfoContainer>
        <p>Don't have an account,</p>
        <button type='button' onClick={() => navigate('/register')}>REGISTER HERE</button>
      </InfoContainer>
    </div>
    </Container>
  )
}

export default Login;