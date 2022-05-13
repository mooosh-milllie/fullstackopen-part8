import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BOOK_DETAILS } from "../service/queries";


const TableDesc = styled.h2`
  margin: 30px 0;
  text-align: center;
`;

const Table = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 70%;
  margin: 0 auto;
  border-radius: 5px;
`;
const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: teal;
  color: white;
`;
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
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const TableButton = styled.button`
  margin: 10px 5px;
  padding: 8px;
  border: none;
  background-color: teal;
  color: white;
  pointer-events: ${(props) => (!props.status && props.next) ? 'none' :  'all'};
  pointer-events: ${(props) => (props.page <= 0) && props.previous ? 'none' :  'all'};
`;

// const initialState = {page: 0};
// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return {
//         page: state.page + 1 
//       }
//     case 'DECREMENT':
//       return {
//         page: state.page - 1
//       }
//     default:
//       break;
//   }
// }
const Books = (props) => {
  
  // const [state, dispatch] = useReducer(reducer, initialState)
  const [page, setPage] = useState(0);
  const {data, loading, refetch} = useQuery(BOOK_DETAILS, {
    variables: {
      page: 0, limit: 4
    },
    fetchPolicy: 'cache-and-network'
  });
  useEffect(() => {
    refetch({page: page})
  }, [page, refetch])
  if (loading) {
    return <div>loading...</div>
  }
  
  // const fetchPages = async(action) => {
  //   await refetch({
  //     page: (action === "INCREMENT") ? page + 1 : page - 1
  //   })
  // }
  return (
    <div>
      <TableDesc>Books</TableDesc>
      <div>
        <p>Search books easily by author's name or genre</p>
        <button type="button"><Link to='/searchbook'>Search book</Link> </button>
      </div>
      <Table>
        <tbody>
          <Tr>
            <Th>Book</Th>
            <Th>author</Th>
            <Th>published</Th>
          </Tr>
          {data.books.books.map((a) => (
            <Tr key={a.id}>
              <Td>{a.title}</Td>
              <Td>{a.author[0].name}</Td>
              <Td>{a.published}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <ButtonContainer>
        <TableButton type="button" onClick={() =>{ setPage(page - 1)}} previous page={page} >
          previous Page
        </TableButton>
        <TableButton type="button" onClick={() =>setPage(page + 1)} next status={data.hasMorePages}>
          next Page
        </TableButton>
      </ButtonContainer>
    </div>
  )
}

export default Books;
