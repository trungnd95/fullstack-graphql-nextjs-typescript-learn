import { Layout } from '@/components/Layout';
import { usePostQuery } from '@/graphql-client/generated/graphql';
import { Alert, AlertIcon, AlertTitle, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function SinglePost() {
  const router = useRouter();
  const { data, loading, error } = usePostQuery({
    variables: {
      id: router.query.id as string,
    },
  });

  if (error || !data?.post) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Post not found</AlertTitle>
        </Alert>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" minW="100wh">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Layout>
      <Flex gap={5} direction="column">
        <Heading>{data?.post!.title} </Heading>
        <Text>{data?.post?.text}</Text>
      </Flex>
    </Layout>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const apolloClient = initializeApollo();

//   const { data } = await apolloClient.query<PaginatedPostsQuery>({
//     query: PaginatedPostsDocument,
//     variables: {
//       limit: 3,
//     },
//   });

//   return {
//     paths: data.posts.paginatedPosts!.map((post) => ({
//       params: {
//         id: post.id,
//       },
//     })),
//     fallback: 'blocking',
//   };
// };

// export const getStaticProps: GetStaticProps<{ [key: string]: any }, { id: string }> = async ({
//   params,
// }) => {
//   const apolloClient = initializeApollo();
//   await apolloClient.query<PostQuery>({
//     query: PostDocument,
//     variables: {
//       id: `${params?.id}`,
//     },
//   });
//   return addApolloState(apolloClient, { props: {} });
// };

export default SinglePost;
