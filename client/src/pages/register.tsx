import InputField from '@/components/InputField';
import Wrapper from '@/components/Wrapper';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

function register() {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={(values) => console.log(values)}
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
