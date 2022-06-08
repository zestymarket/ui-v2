import { Stack, styled, Typography } from '@mui/material';
import React from 'react';
import DiscordNotifications from './DiscordNotification';

const StyledNotifications = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const StyledContainer = styled(Stack)(({ theme }) => ({
  display: `flex`,
  justifyContent: `space-between`,
  maxWidth: `1400px`,
  margin: `40px auto`,
  width: `100%`,
}));

const StyledNotificationList = styled(`div`)({});

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 26,
  fontWeight: 700,
  fontFamily: `Inter`,
  marginBottom: theme.spacing(4),
}));

const Notifications = () => {
  return (
    <StyledNotifications>
      <StyledContainer direction="row">
        <StyledNotificationList>
          <StyledTitle>Notifications</StyledTitle>
        </StyledNotificationList>
        <DiscordNotifications />
      </StyledContainer>
    </StyledNotifications>
  );
};

export default Notifications;
