import { useQuery } from "@apollo/client";
import { useState } from "react";
import styled from "styled-components";
import { ALL_AUTHORS } from "../service/queries";
import AuthorList from "./AuthorList";
import Loading from "./Loading";


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
`;
const Authors = (props) => {
  const {loading, data, error, fetchMore} = useQuery(ALL_AUTHORS, {
    variables: {limit: 2},
    fetchPolicy: "cache-and-network"
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

 
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  
  console.log("Data:::", data);
  return (
    <div>
      <TableDesc>Authors Infomation</TableDesc>
      <Table>
        <tbody>
          <Tr>
            <Th>Name</Th>
            <Th>Born</Th> 
            <Th>no. Books</Th>
          </Tr>
          <AuthorList data={data}/>
          
        </tbody>
      </Table>
      <ButtonContainer>
      {
        data.authors &&
          data.authors.hasMorePages &&
          (isLoadingMore ? (
            <Loading />
          ) : (
            <TableButton
              onClick={async () => {
                setIsLoadingMore(true);
                const bole = await fetchMore({
                  variables: {
                    cursor: data.authors.cursor
                  }
                });
                console.log(bole.data)
                setIsLoadingMore(false);
              }}
            >
              Load More
            </TableButton>
          ))
      }
      </ButtonContainer>
    </div>
  )
}

export default Authors
