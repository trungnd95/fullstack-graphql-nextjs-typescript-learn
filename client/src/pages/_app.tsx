import { useApollo } from '@/lib/apolloClient';
import '@/styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  // const apolloClient = new ApolloClient({
  //   uri: 'http://localhost:4000/graphql',
  //   cache: new InMemoryCache(),
  //   credentials: 'include',
  //   connectToDevTools: true,
  // });
  const apolloClient = useApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
