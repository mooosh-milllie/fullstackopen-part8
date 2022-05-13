import React from 'react';
import FormikTextInput from './FormikTextInput';

const RegisterForm = ({onSubmit}) => {
  return (
    <div>
      <form method='POST' onSubmit={onSubmit}>
        <FormikTextInput name={'username'}/>
        <FormikTextInput name={'password'}/>
        <FormikTextInput name={'favoriteGenre'}/>
        <button type='submit'>Register</button>
      </form>
    </div>
  )
}

export default RegisterForm;