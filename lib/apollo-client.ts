import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            me: {
              merge(existing, incoming, { mergeObjects }) {
                // Always prefer incoming data
                return incoming || existing;
              },
            },
          },
        },
        User: {
          fields: {
            likedAlbums: {
              merge(existing = [], incoming = []) {
                // Completely replace existing liked albums
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only", // Always fetch from network
        nextFetchPolicy: "cache-first", // Use cache after first network fetch
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
};
