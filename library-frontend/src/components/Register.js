import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { REGISTER } from '../service/queries';
import RegisterForm from './RegisterForm';

const validationSchema = yup.object().shape({
  username: yup
  .string()
  .min(5, 'Username must be atleast 5 characters')
  .required('Username is required'),
  password: yup
  .string()
  .min(8, 'Password must be atleast 8 characters')
  .required('Password is required'),
  favoriteGenre: yup
  .string()
  .min(5, 'favorite genre must be atleast 3 characters')
  .required('favorite genre is required'),
});
const initialValues = {
  username: '',
  password: '',
  favoriteGenre: ''
}

const Register = (props) => {
  const navigate = useNavigate();
  const [mutate, result] = useMutation(REGISTER ,
      {
        onError: (error) => {
          console.log(error.graphQLErrors[0].message)
        }
      }
    );


  const onSubmit = async(values) => {
    const {data} = await mutate({
    variables: {
      username: values.username,
      password: values.password,
      favoriteGenre: values.favoriteGenre
    }
   });
   if (data) {
     navigate('/login');
   }
   console.log("Data from onSubmit: ", data);
  }
  useEffect(() => {
    console.log(result.data);
  },[result.data])
  
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ handleSubmit }) => <RegisterForm onSubmit={handleSubmit} />}
      </Formik>
    </div>
  )
}

export default Register;