import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Wrapper from './Wrapper';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <Wrapper size="regular">{children}</Wrapper>
    </>
  );
};
