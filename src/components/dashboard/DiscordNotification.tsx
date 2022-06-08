import { Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const StyledDiscordContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  width: 390,
  maxWidth: `100%`,
  alignItems: `center`,
  justifyContent: `center`,
  padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  textTransform: `uppercase`,
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 26,
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

const StyledStep = styled(`div`)(({ theme }) => ({
  alignSelf: `flex-start`,
  display: `flex`,
  flexDirection: `column`,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  width: `100%`,
  '&:first-of-type': {
    borderBottom: `1px solid #ffffff22`,
  },
}));
const StyledStepTitle = styled(Typography)(({ theme }) => ({
  alignItems: `center`,
  color: theme.palette.primary.contrastText,
  display: `flex`,
  flexDirection: `row`,
  fontSize: 15,
  width: `100%`,
}));
const StyledStepCount = styled(`div`)(({ theme }) => ({
  backgroundColor: `#e5e5e5`,
  color: theme.palette.background.default,
  borderRadius: `50%`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  fontSize: 10,
  height: theme.spacing(2),
  width: theme.spacing(2),
  marginRight: theme.spacing(1),
  opacity: 0.4,
}));

const StyledStepAction = styled(Typography)(({ theme }) => ({
  color: `#808AFF`,
  fontSize: 15,
  fontWeight: 500,
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(),
}));
const StyledStepCopyAction = styled(`div`)(({ theme }) => ({
  alignItems: `center`,
  backgroundColor: `#ffffff22`,
  color: theme.palette.primary.contrastText,
  display: `flex`,
  flexDirection: `row`,
  fontFamily: `Inter`,
  fontSize: 15,
  fontStyle: `italic`,
  justifyContent: `space-between`,
  marginTop: theme.spacing(1.5),
  padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
  width: `100%`,
}));

const DiscordNotifications = () => {
  return (
    <StyledDiscordContainer direction="column">
      <StyledTitle>Join Discord</StyledTitle>
      <StyledSubTitle>Get Notified</StyledSubTitle>
      <Image
        src="/logo/community.png"
        height={100}
        width={225}
        alt="community"
      ></Image>
      <StyledStep>
        <StyledStepTitle>
          <StyledStepCount>1</StyledStepCount>
          Join the &nbsp;<b>Zesty Market Discord</b>
        </StyledStepTitle>
        <StyledStepAction>
          Join our Discord server{` `}
          <Image
            src="/icons/right-arrow-blue.svg"
            alt="go-to-discord"
            width={12}
            height={10}
          />
        </StyledStepAction>
      </StyledStep>
      <StyledStep>
        <StyledStepTitle>
          <StyledStepCount>2</StyledStepCount>
          In the&nbsp;<b>#bot-commands</b>&nbsp;channel type:
        </StyledStepTitle>
        <StyledStepCopyAction>
          <Typography>{`>`}notify</Typography>
          <Image
            src="/icons/clipboard.svg"
            width={16}
            height={16}
            alt="clipboard"
          />
        </StyledStepCopyAction>
      </StyledStep>
    </StyledDiscordContainer>
  );
};

export default DiscordNotifications;
