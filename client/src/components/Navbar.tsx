import { useMeQuery } from '@/graphql-client/generated/graphql';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

function Navbar() {
  const { data, loading: _queryLoading, error: _err } = useMeQuery();
  return (
    <Box bg="tan" p={4}>
      <Flex maxW={800} m="auto" justify="space-between" align="center">
        <Link as={NextLink} href="/" passHref>
          <Heading>Reddit</Heading>
        </Link>
        <Box>
          {!data?.me ? (
            <>
              <Link mr={2} as={NextLink} href="/register" passHref>
                Register
              </Link>
              <Link as={NextLink} href="/login" passHref>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link as={NextLink} href="/logout" passHref>
                Logout
              </Link>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
