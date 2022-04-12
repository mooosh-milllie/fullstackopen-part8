import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setContext } from 'apollo-link-context';
import { ApolloClient, HttpLink, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws';


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  }
})
const httpLink =  new HttpLink({
  uri: 'http://localhost:4000',
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
})
const wsLink = new GraphQLWsLink(createClient({ 
  url: `ws://localhost:4000/graphql`,
  options: {reconnect: true  }}))
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' && 
      definition.operation === 'subscription'
    );
  },  wsLink,  authLink.concat(httpLink),
  
)
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Book: {
        fields: {
          allBooks: {
            merge(existing, incoming, { mergeObjects }) {
              console.log({...existing, ...incoming});
              return mergeObjects(existing, incoming);
            },
          }
        }
      }
    }
  }),
  link: splitLink
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>, 
  document.getElementById('root')
);
