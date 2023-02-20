import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';

interface InputFieldProps {
  name: string;
  placeholder?: string;
  type: string;
  label: string;
}

function InputField({ ...props }: InputFieldProps) {
  const [field, { error }] = useField(props);
  return (
    <FormControl m={5}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input id={field.name} {...props} {...field} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}

export default InputField;
