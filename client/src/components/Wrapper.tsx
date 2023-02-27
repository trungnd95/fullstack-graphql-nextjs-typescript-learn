import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

type IWrapperSize = 'regular' | 'small';
interface IWrapperProps {
  children: ReactNode;
  size?: IWrapperSize;
}

function Wrapper({ children, size = 'small' }: IWrapperProps) {
  return (
    <Box maxW={size == 'regular' ? '800px' : '400px'} w="100%" mt={8} mx="auto">
      {children}
    </Box>
  );
}

export default Wrapper;
