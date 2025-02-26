"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { createApolloClient } from "../lib/apollo-client";
import { useState, ReactNode } from "react";

export default function ApolloProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => createApolloClient());

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
