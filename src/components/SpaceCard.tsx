import React, { useState } from 'react';
import {
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  styled,
  CardActionArea,
} from '@mui/material';
import SpaceData from '@/utils/classes/SpaceData';
import { useRouter } from 'next/router';

const CARD_HEIGHT = 354;

interface SpaceCardProps {
  spaceData?: SpaceData;
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

const StyledPriceValue = styled(Typography)({
  fontSize: 16,
  fontWeight: `bold`,
  marginLeft: 4,
});

const SpaceCard = (props: SpaceCardProps) => {
  const { spaceData } = props;
  const router = useRouter();

  const [lowestPrice] = useState(Number.MAX_VALUE);
  const [price] = useState(`No Open Auctions`);

  if (!spaceData) {
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
        router.push(`/space/${spaceData.id}`);
      }}
    >
      <StyledActionArea>
        <CardMedia
          component="img"
          image={spaceData?.image}
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
                {spaceData?.format === `Square` ||
                spaceData?.format === `Tall` ||
                spaceData?.format === `Wide`
                  ? `Web/WebXR`
                  : spaceData?.format}
              </StyledFormat>
            </Grid>
            <Grid item>
              <StyledName variant="h5">{spaceData?.name}</StyledName>
            </Grid>
            <StyledPrice item container>
              <Grid item>
                <StyledPriceLabel variant="caption">
                  {lowestPrice == Number.MAX_VALUE
                    ? `No Open Auctions`
                    : `Starting at`}
                </StyledPriceLabel>
              </Grid>
              <Grid item>
                <StyledPriceValue variant="caption">
                  {lowestPrice == Number.MAX_VALUE ? `` : price}
                </StyledPriceValue>
              </Grid>
            </StyledPrice>
          </Grid>
        </StyledCardContent>
      </StyledActionArea>
    </StyledCard>
  );
};

export default SpaceCard;
