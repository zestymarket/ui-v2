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
import Image from 'next/image';

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
  maxWidth: 590,
  overflow: `hidden`,
});

const StyledActionArea = styled(CardActionArea)(({ theme }) => ({
  borderRadius: `inherit`,
  border: `1px solid transparent`,
  height: `200px`,
  width: `580px`,
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

const StyledStepIcon = styled(`div`)<{ isCompleted: boolean }>(
  ({ theme, isCompleted }) => ({
    width: 40,
    height: 40,
    borderRadius: `50%`,
    borderWidth: isCompleted ? 0 : 1,
    borderStyle: `solid`,
    borderColor: theme.palette.primary.contrastText,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    background: isCompleted
      ? `linear-gradient(227.67deg, #EF4B23 -60.77%, #F68823 78.53%)`
      : `none`,
  }),
);

const StyledPriceValue = styled(Typography)({
  fontSize: 16,
  fontWeight: `bold`,
  marginLeft: 4,
});

const NotificationCard = () => {
  return (
    <StyledCard>
      <StyledActionArea>
        <StyledCardContent>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            sx={{ height: `100%` }}
          >
            <Grid item>
              <StyledStepIcon>
                <Image src="/icons/twitter.svg" width={16} height={16} />
              </StyledStepIcon>
            </Grid>
            <Grid item>
              <StyledName variant="h5">Name</StyledName>
            </Grid>

            <Grid item>
              <StyledPriceLabel variant="caption">
                Starting at ??
              </StyledPriceLabel>
            </Grid>
            <Grid item>
              <StyledPriceValue variant="caption">Hello</StyledPriceValue>
            </Grid>
          </Grid>
        </StyledCardContent>
      </StyledActionArea>
    </StyledCard>
  );
};

export default NotificationCard;
