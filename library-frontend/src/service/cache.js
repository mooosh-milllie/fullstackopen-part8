import { InMemoryCache } from "@apollo/client";



export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        authors: {
          keyArgs: false,
          merge(existing, incoming) {
            let author = [];
            if (existing && existing.author) {
              console.log("Existn:::", existing)
              author = author.concat(existing.author);
            }
            console.log("Incoming:::", incoming);
            
            if (incoming && incoming.author) {
              author = author.concat(incoming.author);
              console.log("author:::", author)
            }
            console.log("Merged:::",{
              ...incoming,
              author,
            })
            return {
              ...incoming,
              author,
            };
          }
        }
      }
    }
  }
});

