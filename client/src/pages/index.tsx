import { Layout } from '@/components/Layout';
import {
  PaginatedPost,
  Post,
  useDeletePostMutation,
  useMeQuery,
  usePaginatedPostsQuery,
} from '@/graphql-client/generated/graphql';
import { NetworkStatus, Reference } from '@apollo/client';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Link, Stack, Text, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';

const limit = 3;
export default function Home() {
  const toast = useToast();
  const { data: meData, error: meError } = useMeQuery();
  const {
    data,
    loading: _loading,
    error: _error,
    fetchMore,
    networkStatus,
  } = usePaginatedPostsQuery({
    variables: {
      limit,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [deletePost] = useDeletePostMutation();
  console.log('post loading: ', _loading, networkStatus);

  const isLoadingMore = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        cursor: data?.posts.cursor,
      },
    });
  };

  const handleDeletePost = async (postId: string) => {
    const response = await deletePost({
      variables: {
        deleteId: postId,
      },
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            posts(
              existing: Pick<PaginatedPost, 'cursor' | 'hasMore' | 'totalCount'> & {
                paginatedPosts: Reference[];
              },
            ) {
              if (data?.delete.success) {
                return {
                  ...existing,
                  totalCount: existing.totalCount - 1,
                  paginatedPosts: existing.paginatedPosts.filter(
                    (post) => post.__ref != cache.identify(data.delete.post!),
                  ),
                };
              }
              return existing;
            },
          },
        });
      },
    });

    if (response.data) {
      if (response.data.delete.success) {
        toast({
          title: 'Success',
          description: response.data.delete.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.delete.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Layout>
      {/* {loading && !isLoadingMore ? (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      ) : ( */}
      <Stack spacing="10px" padding={'10px'}>
        {data?.posts.paginatedPosts?.map((post: Post) => (
          <Flex shadow="md" p={4} direction="column" key={post.id}>
            <Box w={'full'}>
              <Link as={NextLink} href={`/post/${post.id}`} passHref>
                <Heading>{post.title}</Heading>
              </Link>
              <Text fontStyle={'italic'}>
                Posted by: <b>{post.user.username}</b> on{' '}
                {new Date(post.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' })}
              </Text>
              <Text mt={10}>{post.textSnippet}</Text>
            </Box>
            {!meError && meData && meData?.me?.email === post.user.email && (
              <Flex direction={'row-reverse'} gap={4} w={'full'}>
                <Button type="button">
                  <Link as={NextLink} href={`/post/${post.id}/edit`} passHref>
                    <EditIcon boxSize={8} color="orange.400" />
                  </Link>
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    handleDeletePost(post.id);
                  }}
                >
                  <DeleteIcon boxSize={8} color="red.400" />
                </Button>
              </Flex>
            )}
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
      {/* )} */}
    </Layout>
  );
}

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: PaginatedPostsDocument,
//     variables: {
//       limit,
//     },
//   });

//   return addApolloState(apolloClient, {
//     props: {},
//     //revalidate: 1,
//   });
// }
