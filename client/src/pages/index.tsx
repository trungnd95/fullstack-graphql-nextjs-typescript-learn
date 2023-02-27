import Navbar from '@/components/Navbar';
import { Post, PostDocument, usePostQuery } from '@/graphql-client/generated/graphql';
import { addApolloState, initializeApollo } from '@/lib/apolloClient';
import { Flex, Spinner } from '@chakra-ui/react';

export default function Home() {
  const { data, loading } = usePostQuery();
  return (
    <>
      <Navbar />
      {loading ? (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <div>
          <ul>
            {data?.posts.map((post: Post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
    //revalidate: 1,
  });
}
