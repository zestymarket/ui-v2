/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  styled,
  CardActionArea,
  Link,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import CampaignData from '@/utils/classes/SpaceData';
import { useRouter } from 'next/router';
import * as _ from 'lodash';

const CARD_HEIGHT = 354;

interface CampaignCardProps {
  campaignData?: CampaignData;
  chainId?: number;
}

const StyledCardSkeleton = styled(Card)({
  backgroundColor: `transparent`,
  borderRadius: 16,
  margin: `auto`,
  maxWidth: 290,
  position: `relative`,
});

const StyledCard = styled(Card)({
  borderRadius: 16,
  position: `relative`,
  maxWidth: 290,
  overflow: `hidden`,
});

const StyledActionArea = styled(CardActionArea)(({ theme }) => ({
  borderRadius: `inherit`,
  border: `1px solid transparent`,
  '& .MuiCardActionArea-focusHighlight': {
    display: `none`,
  },
  '&:hover': {
    borderStyle: `solid`,
    borderWidth: 1,
    borderColor: theme.palette.secondary.main,
  },
}));

const StyledCardContent = styled(CardContent)({
  position: `absolute`,
  bottom: 0,
  left: 0,
  background: `linear-gradient(180deg, rgba(24, 21, 34, 0) 0%, #181522 80.73%)`,
  width: `100%`,
  borderRadius: `inherit`,
});

const StyledFormat = styled(Typography)(({ theme }) => ({
  background: `rgba(255, 255, 255, 0.2)`,
  borderRadius: 4,
  color: theme.palette.text.primary,
  fontSize: 10,
  fontWeight: 700,
  padding: 4,
  textTransform: `uppercase`,
}));

const StyledName = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  fontSize: 26,
  lineHeight: `26px`,
  fontWeight: `bold`,
  color: theme.palette.text.primary,
}));

const StyledPrice = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const StyledPriceLabel = styled(Typography)({
  fontSize: 14,
});

const CampaignCard = (props: CampaignCardProps) => {
  const { campaignData } = props;
  const router = useRouter();
  const { chainId } = useWeb3React<Web3Provider>();

  if (!campaignData) {
    return (
      <StyledCardSkeleton>
        <Skeleton variant="rectangular" height={CARD_HEIGHT * 0.6} />
        <Skeleton height={CARD_HEIGHT * 0.2} />
        <Skeleton width="60%" />
      </StyledCardSkeleton>
    );
  }

  return (
    <StyledCard
      onClick={() => {
        router.push(`/campaign/${campaignData.id}`);
      }}
    >
      <StyledActionArea>
        <CardMedia
          component="img"
          image={campaignData?.image}
          height={CARD_HEIGHT}
          sx={{ borderRadius: `inherit` }}
        />

        <StyledCardContent>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            sx={{ height: `100%` }}
          >
            <Grid item>
              <StyledFormat variant="caption">
                {campaignData?.format === `Square` ||
                campaignData?.format === `Tall` ||
                campaignData?.format === `Wide`
                  ? `Web/WebXR`
                  : campaignData?.format}
              </StyledFormat>
            </Grid>
            <Grid item>
              <StyledName variant="h5">{campaignData?.name}</StyledName>
            </Grid>

            <StyledPrice item container>
              <Grid item>
                <StyledPriceLabel variant="caption"></StyledPriceLabel>
              </Grid>
            </StyledPrice>
          </Grid>
        </StyledCardContent>
      </StyledActionArea>
    </StyledCard>
  );
};

export default CampaignCard;
