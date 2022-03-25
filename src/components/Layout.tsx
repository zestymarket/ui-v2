import { styled } from '@mui/system';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const StyledContainer = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <StyledContainer>
      <Header />
      {children}
      <Footer />
    </StyledContainer>
  );
};

export default Layout;
