import React from 'react';

import {
  Card,
  CardContent,
  Link,
  Grid,
  Typography,
  styled,
} from '@mui/material';

import { AddCircleOutline } from '@mui/icons-material';

const StyledCard = styled(Card)({
  position: `relative`,
  maxWidth: 900,
  overflow: `hidden`,
  width: `900px`,
  height: `100%`,
  borderBottom: `1px solid #FFFFFF`,
});

const StyledCardContent = styled(CardContent)({
  borderBottom: `1px solid #FFFFFF`,
  width: `980px`,
});

const StyledStepIcon = styled(`div`)({
  width: 35,
  height: 35,
  borderRadius: `50%`,
  borderWidth: 1,
  borderStyle: `solid`,
  borderColor: `#EF4B23`,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
});

const NotificationTitle = styled(Typography)({
  fontSize: 16,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  lineHeight: `22px`,
  marginLeft: 4,
});
const NotificationLink = styled(Link)({
  fontSize: 14,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  lineHeight: `22px`,
  marginLeft: 4,
});

interface PropsMarkdown {
  markdown: string;
}
interface PropsNotification {
  notification: any;
  notification_type: string;
}

const LinkToMarkdown: React.FC<PropsMarkdown> = ({ markdown }) => {
  const elements: RegExpMatchArray | null = markdown.match(/\[.*?\)/g);
  if (elements !== null && elements[0] != null) {
    const txt: string = (elements[0].match(/\[(.*?)\]/) as any)[1];
    const url: string = (elements[0].match(/\((.*?)\)/) as any)[1];
    return (
      <div>
        <a href={url} target="_blank" rel="noreferrer">
          {txt}
        </a>
      </div>
    );
  } else {
    return <div> Some Error Occurred </div>;
  }
};
const NotificationCard: React.FC<PropsNotification> = ({
  notification,
  notification_type,
}) => {
  switch (notification_type) {
    case `spaceModifiedFrom`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `tokenMintFrom`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `tokenBurnedFrom`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `tokenTransferFrom`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `tokenTransferTo`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `nftDeposited`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `nftWithdrawn`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `auctionCreated`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `auctionCancelled`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `newAuctionOfferBuyer`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `newAuctionOfferSeller`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `auctionWithdrawn`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `auctionOfferSeller`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `auctionOfferBuyer`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    case `auctionOfferRejected`: {
      return (
        <div>
          <StyledCard>
            <StyledCardContent>
              <Grid
                container
                spacing={3}
                direction="row"
                sx={{ height: `100%` }}
              >
                <Grid item>
                  <StyledStepIcon>
                    <AddCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have modified
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][2][`value`]}
                        target="_blank"
                      >
                        Transaction Link ➜
                      </NotificationLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </div>
      );
      break;
    }
    default: {
      return <div></div>;
      break;
    }
  }
};
export default NotificationCard;
