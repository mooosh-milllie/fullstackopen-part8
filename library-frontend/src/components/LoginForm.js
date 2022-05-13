import React from 'react';
import styled from 'styled-components';
import FormikTextInput from './FormikTextInput';

const Container = styled.div`

`;
const Button = styled.button``;
const Form = styled.form``;

const LoginForm = ({onSubmit}) => {
  return (
    <Container>
      <Form method='POST' onSubmit={onSubmit}>
      <FormikTextInput name={'username'}/>
      <FormikTextInput name={'password'}/>
      <Button type="submit">login</Button>
      </Form>
    </Container>
  )
}

export default LoginForm;