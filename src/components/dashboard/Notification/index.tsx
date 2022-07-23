import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { styled } from '@mui/material';
import Head from 'next/head';
import LoadingBar from 'react-top-loading-bar';
import { Box, CircularProgress } from '@mui/material';

import NotificationCard from './notification';
import { getNotifications } from './../../../lib/notification';
import Discord from './discord';
import * as React from 'react';
import Pagination from '@mui/material/Pagination';

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
  display: `grid`,
  gridTemplateColumns: `8fr 4fr`,
  alignItems: `flex-start`,
  rowGap: `10px`,
  flexWrap: `wrap`,
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const StyledWrapper = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Notifications() {
  const { account } = useWeb3React<Web3Provider>();
  const [loadingMore] = useState<boolean>(false);
  const [loadingData] = useState<boolean>(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const [notificationPage, setNotificationPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setNotificationPage(newPage);
  };
  useEffect(() => {
    async function notifs() {
      if (account) {
        const notifications = await getNotifications(account, notificationPage);
        setNotificationsData(notifications.data.data);
        setTotalPages(notifications.data.total_pages);
      }
    }
    if (account) notifs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationPage]);
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
        <div>
          {!loadingData &&
            notificationsData?.length > 0 &&
            notificationsData.map((notification, i) => {
              return (
                <NotificationCard
                  notification={notification[`notification`]}
                  notification_type={notification[`type`]}
                  key={i}
                />
              );
            })}
          {notificationPage > 1 && (
            <Pagination
              defaultPage={notificationPage}
              onChange={handleChangePage}
              count={totalPages}
              color="primary"
            />
          )}
          {!loadingData && notificationsData?.length === 0 && (
            <div>You do not have any notifications</div>
          )}
        </div>

        <Discord />
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
      </Container>
    </StyledWrapper>
  );
}
