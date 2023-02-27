import { Layout } from '@/components/Layout';
import { Post, PostDocument, usePostQuery } from '@/graphql-client/generated/graphql';
import { addApolloState, initializeApollo } from '@/lib/apolloClient';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Home() {
  const { data, loading } = usePostQuery();
  return (
    <Layout>
      {loading ? (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing="10px">
          {data?.posts.map((post: Post) => (
            <Flex shadow="md" p={4} direction="column">
              <Box w={'full'}>
                <Link as={NextLink} href={`/post/${post.id}`} passHref>
                  <Heading>{post.title}</Heading>
                </Link>
                <Text fontStyle={'italic'}>Posted by: author </Text>
                <Text mt={10}>{post.text}</Text>
              </Box>
              <Flex direction={'row-reverse'} gap={4} w={'full'}>
                <EditIcon boxSize={8} color="orange.400" />
                <DeleteIcon boxSize={8} color="red.400" />
              </Flex>
            </Flex>
          ))}
        </Stack>
      )}
    </Layout>
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
