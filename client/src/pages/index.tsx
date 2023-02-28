import { Layout } from '@/components/Layout';
import {
  PaginatedPostsDocument,
  Post,
  usePaginatedPostsQuery,
} from '@/graphql-client/generated/graphql';
import { addApolloState, initializeApollo } from '@/lib/apolloClient';
import { NetworkStatus } from '@apollo/client';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const limit = 1;
export default function Home() {
  const { data, loading, error, fetchMore, networkStatus } = usePaginatedPostsQuery({
    variables: {
      limit,
    },
    notifyOnNetworkStatusChange: true,
  });
  if (data) console.log(data);

  const isLoadingMore = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        limit,
        cursor: data?.posts.cursor,
      },
    });
  };
  return (
    <Layout>
      {loading ? (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing="10px">
          {data?.posts.paginatedPosts?.map((post: Post) => (
            <Flex shadow="md" p={4} direction="column" key={post.id}>
              <Box w={'full'}>
                <Link as={NextLink} href={`/post/${post.id}`} passHref>
                  <Heading>{post.title}</Heading>
                </Link>
                <Text fontStyle={'italic'}>Posted by: {post.user.username} </Text>
                <Text mt={10}>{post.textSnippet}</Text>
              </Box>
              <Flex direction={'row-reverse'} gap={4} w={'full'}>
                <EditIcon boxSize={8} color="orange.400" />
                <DeleteIcon boxSize={8} color="red.400" />
              </Flex>
            </Flex>
          ))}
          {data?.posts.hasMore && (
            <Flex justify={'center'} align="center">
              <Button type="button" isLoading={isLoadingMore} onClick={loadMorePosts}>
                {isLoadingMore ? 'Loading' : 'Load More'}
              </Button>
            </Flex>
          )}
        </Stack>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PaginatedPostsDocument,
    variables: {
      limit,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
    //revalidate: 1,
  });
}
