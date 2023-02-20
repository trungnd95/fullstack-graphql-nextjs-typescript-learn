import InputField from '@/components/InputField';
import Wrapper from '@/components/Wrapper';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  username: string;
  email: string;
  password: string;
}

const FormValidateSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Required!!!'),
  username: Yup.string().min(3, 'Username must be at least 3 characters').required(),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required(),
});

function register() {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', email: '', password: '' } as FormValues}
        validationSchema={FormValidateSchema}
        onSubmit={(values: FormValues) => console.log(values)}
      >
        {({ isSubmitting, errors, touched }) => (
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
