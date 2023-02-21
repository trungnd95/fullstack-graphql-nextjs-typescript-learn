import InputField from '@/components/InputField';
import Wrapper from '@/components/Wrapper';
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  UserLoginInput,
} from '@/graphql-client/generated/graphql';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

const FormValidateSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required(),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required(),
});

function login() {
  const router = useRouter();
  const [loginUser, { data, loading: _loginLoading, error }] = useLoginMutation();
  return (
    <Wrapper>
      {error && <p style={{ color: 'red' }}>{`Failed to request to server. ${error}`}</p>}
      {data && (
        <p style={{ color: data?.login?.success ? 'green' : 'red' }}>{`${data?.login?.message}`}</p>
      )}
      <Formik
        initialValues={{ username: '', password: '' } as UserLoginInput}
        validationSchema={FormValidateSchema}
        onSubmit={async (values: UserLoginInput) => {
          const response = await loginUser({
            variables: { loginInput: values },
            update: (cache, data) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: data.data?.login.user },
              });
            },
          });

          if (response.data?.login?.success) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Username" name="username" placeholder="john" type="text" />
            <InputField label="Password" name="password" type="password" />
            <Button type="submit" colorScheme="blue" w="100%" isLoading={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default login;
