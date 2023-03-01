import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';

interface InputFieldProps {
  name: string;
  placeholder?: string;
  type?: string;
  label: string;
  textarea?: boolean;
}

function InputField({ textarea, ...props }: InputFieldProps) {
  const [field, { error, touched }] = useField(props);
  let InputEle = !textarea ? Input : Textarea;

  return (
    <FormControl m={5} isInvalid={(error && touched) as boolean | undefined}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <InputEle id={field.name} {...props} {...field} />
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}

export default InputField;
