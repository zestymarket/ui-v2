import React from 'react';
import Image from 'next/image';
import { Grid } from '@mui/material';
import { styled } from '@mui/system';
import LandingButton from '../components/LandingButton';

const StyledHeader = styled(Grid)({
  maxWidth: 560,
  fontStyle: `normal`,
  fontWeight: 700,
  fontSize: 60,
  lineHeight: `56px`,
  letterSpacing: `-0.02em`,
});

const StyledSubHeader = styled(Grid)({
  maxWidth: 560,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 18,
  lineHeight: `24px`,
  opacity: 0.6,
});

const StyledMidText = styled(Grid)({
  maxWidth: 560,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 26,
  lineHeight: `30px`,
  opacity: 0.8,
  letterSpacing: `-0.02em`,
  color: `white`,
});

const Landing = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{
        width: `100%`,
        height: `100%`,
      }}
    >
      <Grid
        style={{
          height: 1000,
          width: `100%`,
          margin: `auto`,
          background: `url(/landing/landing_title.png)`,
        }}
      >
        <Grid
          style={{
            paddingTop: `20%`,
            maxWidth: `1400px`,
            margin: `auto`,
          }}
        >
          <StyledHeader mb={2}>
            Marketplace for rentable billboards in the metaverse
          </StyledHeader>
          <StyledSubHeader mb={4}>
            Zesty Market is a web3-enabled and tokenized advertising marketplace
            for Internet Communities owned by Internet Communities.
          </StyledSubHeader>
          <Grid container direction="row" alignItems="stretch">
            <LandingButton bold>Launch App</LandingButton>
            <LandingButton outlined>Learn More</LandingButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        style={{
          paddingTop: `5%`,
          maxWidth: `1400px`,
          margin: `auto`,
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="stretch"
          style={{
            width: `100%`,
            height: `100%`,
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="stretch"
            style={{
              width: `100%`,
            }}
          >
            <Image
              src="/landing/Icon01.png"
              alt="Figure standing infrom of multiple floating monitors"
              width={500}
              height={500}
            />
            <Grid style={{ alignSelf: `center` }}>
              <StyledHeader mb={3}>Agencies and Individuals </StyledHeader>
              <StyledMidText mb={3}>
                Agencies and individuals can create and deploy data-rich
                multiversal compaigns across virtual worlds both on and
                off-chain
              </StyledMidText>
              <StyledSubHeader>
                Reach an audience of over 500,000 visitors in the metaverse each
                month. Advertisers see an average click-through rate of 12%.
                Measure ad performance with real time data.
              </StyledSubHeader>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="stretch"
            style={{
              width: `100%`,
            }}
          >
            <Grid style={{ alignSelf: `center` }}>
              <StyledHeader mb={3}>Virtual Property Owners</StyledHeader>
              <StyledMidText mb={3}>
                Virtual Property Owners can further monetize and increase the
                value of their properties by renting out ad spaces
              </StyledMidText>
              <StyledSubHeader>
                Generate revenue from billboard space rental. Control how and
                where billboards are displayed. Leverage ad visibility and
                revenue data to demonstrate property value.
              </StyledSubHeader>
            </Grid>
            <Image
              src="/landing/Icon02.png"
              alt="Figure with a glowing sphere floatign above their open palm"
              width={500}
              height={500}
            />
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="stretch"
            style={{
              width: `100%`,
            }}
          >
            <Image
              src="/landing/Icon03.png"
              alt="Figure standing touching a lit screen"
              width={500}
              height={500}
            />
            <Grid style={{ alignSelf: `center` }}>
              <StyledHeader mb={3}>
                Virtual World and Space Creators
              </StyledHeader>
              <StyledMidText mb={3}>
                Virtual World and Space Creators can create a seamless and
                non-intrusive advertising experience for their users while
                increasing total world value
              </StyledMidText>
              <StyledSubHeader>
                On-chain revenue stats ensure transparency and reduce ad fraud.
                Our open-source SDK is easy to integrate with most worlds and
                spaces. Dashboards to manage multiple spaces at once.
              </StyledSubHeader>
            </Grid>
          </Grid>
          <LandingButton bold style={{ alignSelf: `center` }}>
            Launch App
          </LandingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Landing;
