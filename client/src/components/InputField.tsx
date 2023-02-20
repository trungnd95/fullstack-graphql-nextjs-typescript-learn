import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';

interface InputFieldProps {
  name: string;
  placeholder?: string;
  type: string;
  label: string;
}

function InputField({ ...props }: InputFieldProps) {
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl m={5} isInvalid={(error && touched) as boolean | undefined}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input id={field.name} {...props} {...field} />
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}

export default InputField;
