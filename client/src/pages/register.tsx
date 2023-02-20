import InputField from '@/components/InputField';
import Wrapper from '@/components/Wrapper';
import { useRegisterMutation, UserRegisterInput } from '@/graphql-client/generated/graphql';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

const FormValidateSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Required!!!'),
  username: Yup.string().min(3, 'Username must be at least 3 characters').required(),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required(),
});

function register() {
  const router = useRouter();
  const [registerUser, { loading: _registerLoading, error }] = useRegisterMutation();
  return (
    <Wrapper>
      {error && <p style={{ color: 'red' }}>{`Failed to request to server. ${error}`}</p>}
      <Formik
        initialValues={{ username: '', email: '', password: '' } as UserRegisterInput}
        validationSchema={FormValidateSchema}
        onSubmit={async (values: UserRegisterInput) => {
          const response = await registerUser({
            variables: { registerInput: values },
          });

          if (response.data?.register?.success) {
            router.push('/');
          } else {
            alert(response.data?.register?.message);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Email" name="email" placeholder="john@gmail.com" type="text" />
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

export default register;
