import InputField from '@/components/InputField';
import { Layout } from '@/components/Layout';
import {
  PaginatedPost,
  PostCreateInput,
  useCreatePostMutation,
} from '@/graphql-client/generated/graphql';
import { useCheckAuth } from '@/utils/checkAuth';
import { Button, Flex, Link, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import * as Yup from 'yup';

const FormValidateSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Title must be at least 3 characters').required(),
  text: Yup.string().min(10, 'Text must be at least 5 characters').required(),
});

export const CreatePost: React.FC<{}> = () => {
  const { data, loading: checkAuthLoading } = useCheckAuth();
  const [createPost, { error }] = useCreatePostMutation();
  const router = useRouter();
  const toast = useToast();
  return checkAuthLoading || (!checkAuthLoading && !data?.me) ? (
    <Flex height="100vh" width="100wh" justify="center" align="center">
      <Spinner />
    </Flex>
  ) : (
    <Layout>
      {error && <p style={{ color: 'red' }}>{`Failed to request to server. ${error}`}</p>}
      <Formik
        initialValues={{ title: '', text: '' }}
        validationSchema={FormValidateSchema}
        onSubmit={async (values: PostCreateInput) => {
          const response = await createPost({
            variables: { createPostInput: values },
            update: (cache, { data }) => {
              cache.modify({
                fields: {
                  posts(
                    existing: Pick<PaginatedPost, 'cursor' | 'hasMore' | 'totalCount'> & {
                      paginatedPosts: { __ref: string }[];
                    },
                  ) {
                    if (data?.create.success && data.create.post) {
                      return {
                        ...existing,
                        paginatedPosts: [
                          { __ref: cache.identify(data.create.post) },
                          ...existing.paginatedPosts,
                        ],
                      };
                    }
                  },
                },
              });
            },
          });
          if (response.data?.create?.success) {
            router.push('/');
            toast({
              title: 'Success',
              description: response.data.create.message,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Title" name="title" placeholder="title" type="text" />
            <InputField label="Text" name="text" placeholder="text" textarea={true} />
            <Flex align="center" justify={'space-around'}>
              <Button
                type="submit"
                colorScheme="blue"
                w="45%"
                textAlign={'center'}
                isLoading={isSubmitting}
              >
                Create
              </Button>
              <Button colorScheme="gray" w="45%" textAlign={'center'} isLoading={isSubmitting}>
                <Link as={NextLink} href="/" passHref>
                  Back to Home
                </Link>
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
