import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getClient } from '@/lib/graphql';
import { styled } from '@mui/material';
import NotificationCard from './notification';
// import Button from '@/components/Button';
import Head from 'next/head';
import LoadingBar from 'react-top-loading-bar';
import { Box, CircularProgress } from '@mui/material';

const Header = styled(`header`)({
  display: `flex`,
  justifyContent: `space-between`,
  alignItems: `center`,
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const H1 = styled(`h1`)({
  fontWeight: 700,
  fontSize: `26px`,
  letterSpace: -0.02,
});

const Container = styled(`div`)({
  display: `flex`,
  justifyContent: `space-between`,
  rowGap: `40px`,
  flexWrap: `wrap`,
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const StyledWrapper = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function MySpaces() {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const client = getClient(chainId ?? 0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [notificationsData, setNotificationsData] = useState([]);
  return (
    <StyledWrapper>
      <LoadingBar progress={loadingMore ? 50 : 100} />
      <Head>
        <title>Notifications</title>
      </Head>
      <Header>
        <H1>Notifications</H1>
      </Header>
      <Container>
        {!loadingData &&
          notificationsData?.length > 0 &&
          notificationsData.map((notification, i) => {
            return <NotificationCard key={i} />;
          })}
        <NotificationCard />
        {loadingData && (
          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            marginTop="50px"
            paddingBottom="100px"
          >
            <CircularProgress />
          </Box>
        )}
        {!loadingData && notificationsData?.length === 0 && (
          <div>No Notifications</div>
        )}
      </Container>
    </StyledWrapper>
  );
}
