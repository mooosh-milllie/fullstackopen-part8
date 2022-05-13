import React from 'react';
import styled from 'styled-components';
import FormikTextInput from './FormikTextInput';

const Container = styled.div`

`;
const Button = styled.button``;
const Form = styled.form``;

const BookSearchForm = ({onSubmit}) => {
  return (
    <Container>
      <Form method='POST' onSubmit={onSubmit}>
      <FormikTextInput name={'author'}/>
      <FormikTextInput name={'genre'}/>
      <Button type="submit">Search</Button>
      </Form>
    </Container>
  )
}

export default BookSearchForm;