import InputField from '@/components/InputField';
import { Layout } from '@/components/Layout';
import {
  PostCreateInput,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from '@/graphql-client/generated/graphql';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Link,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

const FormValidateSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Title must be at least 3 characters').required(),
  text: Yup.string().min(10, 'Text must be at least 5 characters').required(),
});

function edit() {
  const toast = useToast();
  const router = useRouter();
  const { data: meData, loading: meLoading, error: meError } = useMeQuery();
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = usePostQuery({
    variables: {
      id: router.query.id as string,
    },
  });

  const [updatePost, { loading, error: updatePostError }] = useUpdatePostMutation();

  if (meLoading || postLoading || !meData || !postData) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  }

  if (meData.me && postData.post && meData?.me.email !== postData.post.user.email) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Unauthorized</AlertTitle>
        </Alert>
      </Layout>
    );
  }

  if (postData && !postData.post) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Post not found</AlertTitle>
        </Alert>
      </Layout>
    );
  }

  if (meError || postError) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Request failed</AlertTitle>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      {updatePostError && (
        <p style={{ color: 'red' }}>{`Failed to request to server. ${updatePostError}`}</p>
      )}
      <Formik
        initialValues={{ title: postData.post!.title, text: postData.post!.text }}
        validationSchema={FormValidateSchema}
        onSubmit={async (values: PostCreateInput) => {
          const response = await updatePost({
            variables: {
              postUpdateInput: values,
              updateId: postData.post!.id,
            },
          });
          if (response.data?.update?.success) {
            router.push('/');
            toast({
              title: 'Success',
              description: response.data.update.message,
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
}

export default edit;
