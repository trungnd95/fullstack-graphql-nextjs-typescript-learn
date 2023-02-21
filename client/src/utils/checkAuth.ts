import { useMeQuery } from '@/graphql-client/generated/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useCheckAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (data?.me && (router.asPath === '/login' || router.pathname === '/register')) {
        router.replace('/');
      }
    }
  }, [data, loading, router]);
  return { data, loading };
};
