import React from 'react';
import Bid from './Bid';
import {
  Card,
  CardContent,
  Link,
  Grid,
  Typography,
  styled,
} from '@mui/material';

import {
  AddCircleOutline,
  RemoveCircleOutline,
  Send,
} from '@mui/icons-material';

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
  if (elements !== null && elements.length > 0 && elements[0] != null) {
    const txt: string = (elements[0].match(/\[(.*?)\]/) as any)[1];
    let url: string = (elements[0].match(/\((.*?)\)/) as any)[1];
    url = url.replaceAll(`https://app.zesty.market/`, `/`);

    return (
      <NotificationLink href={url} target="_blank" rel="noreferrer">
        {txt}
      </NotificationLink>
    );
  } else {
    return <div> {markdown} </div>;
  }
};

const returnID = (markdown: string) => {
  const elements: RegExpMatchArray | null = markdown.match(/\[.*?\)/g);
  if (elements !== null && elements.length > 0 && elements[0] != null) {
    let url: string = (elements[0].match(/\((.*?)\)/) as any)[1];
    url = url.replaceAll(`https://app.zesty.market/`, `/`);
    return url;
  } else {
    return `0`;
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
                        You have modified space {` `}
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
    case `rentalContractCreatedSeller`: {
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
                        New rental contract has been created
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
    case `rentalContractCreatedBuyer`: {
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
                        New rental contract has been created
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
    case `rentalContractCreatedSeller`: {
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
                        New rental contract has been created
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
    case `rentalContractCompletedSeller`: {
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
                        New rental contract has been completed
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
    case `rentalContractCompletedBuyer`: {
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
                        New rental contract has been completed
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
                        You have minted a new token
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
                    <RemoveCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have burned token
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
                    <Send fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have transferred your token
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
    case `campaignCreatedBuyer`: {
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
                        You have receieved a token
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
      console.log(notification);
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
                        You have receieved a token
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
                        You have deposited a NFT
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
                    <RemoveCircleOutline fontSize="medium" />
                  </StyledStepIcon>
                </Grid>
                <Grid item>
                  <Grid container direction="column" sx={{ height: `100%` }}>
                    <Grid item>
                      <NotificationTitle>
                        You have withdrawn NFT
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
                        You have created an auction
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
                        You have cancelled auction
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
                        You have sent a new auction offer on
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
                  <Bid
                    auctionLink={
                      <LinkToMarkdown
                        markdown={notification[`description`]}
                      ></LinkToMarkdown>
                    }
                    price={notification[`fields`][1][`value`]}
                    txLink={notification[`fields`][2][`value`]}
                    id={returnID(notification[`description`])}
                  />
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
                        You have withdrawn auction
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
    case `auctionOfferSellerAccepted`: {
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
                        Auction Offer Accepted
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
    case `auctionOfferBuyerAccepted`: {
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
                        Your auction Offer
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                        {` `}
                        has been accepted
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
    case `auctionOfferRejectedSeller`: {
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
                        You have rejected auction offer
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
    case `auctionOfferRejectedBuyer`: {
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
                        Auction Offer rejected by buyer on auction
                        <LinkToMarkdown
                          markdown={notification[`description`]}
                        ></LinkToMarkdown>
                      </NotificationTitle>
                    </Grid>
                    <Grid item>
                      <NotificationLink
                        href={notification[`fields`][1][`value`]}
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
