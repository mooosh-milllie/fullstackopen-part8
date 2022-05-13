import React from 'react';
import styled from 'styled-components';

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;
const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const AuthorList = ({data}) => {
  return (
      data.authors &&
      data.authors.author &&
      data.authors.author.map((a) => (
      <Tr key={a.id}>
        <Td>{a.name}</Td>
        <Td>{a.born}</Td>
        <Td>{a.books.length}</Td>
      </Tr>
    ))
  )
}

export default AuthorList;