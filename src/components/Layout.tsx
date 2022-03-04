import { styled } from '@mui/system';
import React from 'react';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const StyledContainer = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <StyledContainer>
      <Header />
      {children}
    </StyledContainer>
  );
};

export default Layout;
