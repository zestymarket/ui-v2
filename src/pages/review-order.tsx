/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  TableContainer,
  Table,
  TableBody,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useSelector } from 'react-redux';
import { PageContext } from '../lib/context/page';
import { RootState } from '../lib/redux/rootReducer';
import { TableBodyCell } from '@/components/based/AuctionDataTable/styles';
import {
  DataTableHead,
  StyledTableRow,
  AuctionData,
  Order,
  HeadCell,
} from '@/components/based/AuctionDataTable';
import { getClient } from '@/lib/graphql';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGN_BY_BUYER } from '@/lib/queries';
import { convertOldFormats } from '@/utils/formats';
import { formatIpfsUri, formatUSDC } from '@/utils/helpers';
import CampaignData from '@/utils/classes/CampaignData';
import { styled } from '@mui/material';
import { useZestyMarketUSDC, useUSDC } from '@/utils/hooks';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { useSnackbar } from 'notistack';
import NotEnoughFunds from '@/components/based/CartPreview/NotEnoughFunds';
import WarningBanner from '@/components/WarningBanner';
import Button from '@/components/Button';
import { useConfirm } from 'material-ui-confirm';
import _ from 'lodash';
import { useRouter } from 'next/router';
import {
  calculatePrice,
  getContractDuration,
  getAuctionStartsIn,
} from '@/utils/classes/Auction';

const headCells: readonly HeadCell[] = [
  {
    id: `id`,
    numeric: true,
    disablePadding: true,
    label: `ID`,
  },
  {
    id: `contractStartTime`,
    numeric: false,
    disablePadding: true,
    label: `Contract Start Time`,
  },
  {
    id: `duration`,
    numeric: false,
    disablePadding: true,
    label: `Duration`,
  },
  {
    id: `space`,
    numeric: false,
    disablePadding: true,
    label: `Space`,
  },
  {
    id: `price`,
    numeric: false,
    disablePadding: true,
    label: `Price`,
  },
];

const campaignHeadCells: readonly HeadCell[] = [
  {
    id: `id`,
    numeric: true,
    disablePadding: true,
    label: `ID`,
  },
  {
    id: `campaignName`,
    numeric: false,
    disablePadding: true,
    label: `Campaign Name`,
  },
  {
    id: `description`,
    numeric: false,
    disablePadding: true,
    label: `Description`,
  },
  {
    id: `c2aUrl`,
    numeric: false,
    disablePadding: true,
    label: `C2A URL`,
  },
];

const IDAndImage = styled(`div`)`
  display: flex;
  align-items: center;
  span {
    margin-right: 20px;
  }
`;

const WarningContent = styled(`p`)`
  color: #211d35;
  b {
    font-weight: 700;
  }
`;

const StyledButton = styled(Button)`
  padding: 16px !important;
  margin: 20px 0 0 0 !important;
  width: 140px !important;
  height: 50px;
  font-weight: 500;
`;

const AccordionHeader = styled(AccordionSummary)`
  background: #181522;
  padding: 0 20px;
  height: 80px;
  border-radius: 8px;
  -webkit-box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.075);
  -moz-box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.075);
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.075);
`;

const NEW_CAMPAIGN_OBJ = {
  id: ``,
  name: `+ New Campaign`,
  description: ``,
  url: ``,
  image: ``,
} as unknown as CampaignData;

enum ConfirmStatus {
  PENDING,
  NOT_ENOUGH_FUNDS,
  PROCEED,
}

const ReviewOrderPage = () => {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const router = useRouter();
  const { setPageName } = React.useContext(PageContext);
  const [order, setOrder] = useState<Order>(`asc`);
  const [orderBy, setOrderBy] = useState<keyof AuctionData>(`id`);
  const [approved, setApproved] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const auctions = useSelector(
    (state: RootState) => state.auctionBasketReducer.auctions,
  );
  const confirmDialog = useConfirm();

  const zestyMarketUSDC = useZestyMarketUSDC(true);
  const contractUSDC = useUSDC(true);
  const total = auctions.reduce(
    (sum, auction) =>
      (sum += calculatePrice(
        auction.auctionTimeStart,
        auction.contractTimeEnd,
        auction.priceStart,
      )),
    0,
  );
  const [campaignPerFormat, setCampaignPerFormat] = useState<
    Record<string, any>
  >({});
  const [confirmStatus, setConfirmStatus] = useState<ConfirmStatus>(
    ConfirmStatus.PENDING,
  );
  contractUSDC
    .allowance(account, zestyMarketUSDC?.address)
    .then((allowance: BigNumber) => {
      if (
        allowance.gte(BigNumber.from((total * 10 ** 6).toFixed(0).toString()))
      ) {
        setApproved(true);
      }
    });
  contractUSDC.balanceOf(account).then((balance: BigNumber) => {
    setUsdcBalance(parseFloat(formatUSDC(balance)));
  });
  function handleApprove() {
    if (!approved) {
      contractUSDC
        .allowance(account, zestyMarketUSDC.address)
        .then((allowance: any) => {
          if (allowance.lt(parseUnits(total.toString(), 6))) {
            contractUSDC
              .approve(
                zestyMarketUSDC.address,
                BigNumber.from(`99999999999999`),
              )
              .then((res: any) => {
                enqueueSnackbar(`Transaction pending...`, {
                  variant: `info`,
                  autoHideDuration: 15000,
                });
                res
                  .wait()
                  .then(() => {
                    enqueueSnackbar(`Successfully approved USDC`, {
                      variant: `success`,
                    });
                    setApproved(true);
                  })
                  .catch((e: any) => {
                    enqueueSnackbar(e.message, {
                      variant: `error`,
                    });
                  });
              })
              .catch((e: any) => {
                enqueueSnackbar(e.message, {
                  variant: `error`,
                });
              });
          } else {
            setApproved(true);
          }
        });
    }
  }
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AuctionData,
  ) => {
    const isAsc = orderBy === property && order === `asc`;
    setOrder(isAsc ? `desc` : `asc`);
    setOrderBy(property);
  };
  const client = getClient(chainId ?? 0);
  const [userCampaigns, setUserCampaigns] = useState<CampaignData[]>([
    NEW_CAMPAIGN_OBJ,
  ]);
  const { data, loading, error } = useQuery(GET_CAMPAIGN_BY_BUYER, {
    variables: {
      buyer: account,
      first: 64,
      skip: 0,
    },
    fetchPolicy: `network-only`,
    client: client,
  });
  useEffect(() => {
    if (loading == false && !error && data) {
      const newCampaigns: any[] = [];
      Promise.all(
        data.buyerCampaigns.map(async (buyerCampaign: CampaignData) => {
          const url = formatIpfsUri(buyerCampaign.uri);
          const uriData = await (await fetch(url)).json();
          const obj = { ...buyerCampaign };
          obj.name = uriData.name;
          obj.description = uriData.description;
          obj.url = uriData.url;
          obj.image = formatIpfsUri(uriData.image);
          obj.format = uriData.format;
          newCampaigns.push(obj);
        }),
      ).then(() => setUserCampaigns([NEW_CAMPAIGN_OBJ, ...newCampaigns]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    //   if (query.verified) {
    //     enqueueSnackbar(`Your email address has been successfully verified!`, {
    //       variant: `success`,
    //     });
    //   }
    setPageName(`Review Order`);
  }, [setPageName]);
  const groupedAuctions = _.groupBy(auctions, (auction) =>
    convertOldFormats((auction as any).format),
  );
  function confirmTransaction(format: string): Promise<any> {
    const ids = groupedAuctions[format].map((auction) =>
      BigNumber.from(auction.id),
    );
    const selectedCampaign = campaignPerFormat[format];
    const campaign = BigNumber.from(selectedCampaign?.id || 0); // TODO: What should happen when New Campaign is selected?
    setIsLoading(true);
    const plural = ids.length > 1 ? `s` : ``;
    return zestyMarketUSDC
      .sellerAuctionBidBatch(ids, campaign)
      .then((res: any) => {
        enqueueSnackbar(`Transaction pending...`, {
          variant: `info`,
          autoHideDuration: 15000,
        });
        res
          .wait()
          .then(() => {
            enqueueSnackbar(
              `Successfully bought time slot${plural}. Please wait for the creator of the billboard to approve your campaign${plural}.`,
              {
                variant: `success`,
                autoHideDuration: 15000,
              },
            );
            setIsLoading(false);
          })
          .catch((e: any) => {
            enqueueSnackbar(e.message, {
              variant: `error`,
            });
            setIsLoading(false);
          });
      })
      .catch((e: any) => {
        enqueueSnackbar(e.message, {
          variant: `error`,
        });
        setIsLoading(false);
      });
  }
  function confirm() {
    if (approved && usdcBalance < total) {
      setConfirmStatus(ConfirmStatus.NOT_ENOUGH_FUNDS);
      return;
    }
    // if (Object.keys(groupedAuctions).length === 1) {
    //   // buy immediately
    //   return;
    // }
    const iterator = Object.entries(groupedAuctions)[Symbol.iterator]();
    (function confirmFormats() {
      const next = iterator.next();
      if (next.done) {
        router.push(`/dashboard`);
        return;
      }
      const format = next.value[0];
      confirmDialog({
        title: next.value[0],
        content: (
          <h4>
            Total:{` `}
            {next.value[1]
              .reduce(
                (sum: any, auction: any) =>
                  sum +
                  calculatePrice(
                    auction.auctionTimeStart,
                    auction.contractTimeEnd,
                    auction.priceStart,
                  ),
                0,
              )
              .toFixed(2)}
            {` `}
            USDC
          </h4>
        ),
      })
        .then(() => {
          confirmTransaction(format).then(confirmFormats);
        })
        .catch(() => {
          //
        });
    })();
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{ maxWidth: `1400px`, margin: `auto` }}
    >
      <h2>Space Details</h2>
      {Object.entries(groupedAuctions).map(([format, rows]) => {
        const total = rows.reduce(
          (sum, auction) =>
            (sum += calculatePrice(
              auction.auctionTimeStart,
              auction.contractTimeEnd,
              auction.priceStart,
            )),
          0,
        );
        const filteredCampaigns = userCampaigns.filter(
          (campaign) =>
            convertOldFormats(campaign.format) === convertOldFormats(format),
        );
        filteredCampaigns.unshift(NEW_CAMPAIGN_OBJ);
        const selectedCampaign = campaignPerFormat[format];
        return (
          <Accordion key={format} defaultExpanded={true}>
            <AccordionHeader
              expandIcon={<ExpandMoreIcon color="primary" />}
              color="blue"
            >
              <h4>{format}</h4>
            </AccordionHeader>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <DataTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headCells={headCells}
                  />
                  <TableBody>
                    {rows.sort().map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <StyledTableRow hover tabIndex={-1} key={row.id}>
                          <TableBodyCell
                            align="right"
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.id}
                          </TableBodyCell>
                          <TableBodyCell align="left">
                            {getAuctionStartsIn(row.contractTimeStart)}
                          </TableBodyCell>
                          <TableBodyCell align="left">{`${getContractDuration(
                            row.contractTimeStart,
                            row.contractTimeEnd,
                          )}`}</TableBodyCell>
                          <TableBodyCell align="left">{`${
                            (row as any).name
                          }`}</TableBodyCell>
                          <TableBodyCell align="left">
                            <b>
                              {calculatePrice(
                                row.auctionTimeStart,
                                row.contractTimeEnd,
                                row.priceStart,
                              ).toFixed(2)}
                            </b>
                            USDC
                          </TableBodyCell>
                        </StyledTableRow>
                      );
                    })}
                    <StyledTableRow tabIndex={-1}>
                      <TableBodyCell style={{ borderBottom: 0 }} />
                      <TableBodyCell style={{ borderBottom: 0 }} />
                      <TableBodyCell style={{ borderBottom: 0 }} />
                      <TableBodyCell align="left">
                        <b>TOTAL</b>
                      </TableBodyCell>
                      <TableBodyCell align="left">
                        <b>{total.toFixed(2)}</b>USDC
                      </TableBodyCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <h4>Campaign Details</h4>
              <TextField
                fullWidth={true}
                onChange={(e) => {
                  const campaign = JSON.parse(e.target.value as string);
                  if (campaign.name == NEW_CAMPAIGN_OBJ.name) {
                    router.push(`/create-campaign`);
                  }
                  setCampaignPerFormat({
                    ...campaignPerFormat,
                    [format]: campaign,
                  });
                }}
                select
                label="Select Campaign"
              >
                {filteredCampaigns.map((campaign: any) => (
                  <MenuItem value={JSON.stringify(campaign)} key={campaign.id}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              {selectedCampaign?.id && (
                <TableContainer>
                  <Table size="small">
                    <DataTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      headCells={campaignHeadCells}
                    />

                    <TableBody>
                      <StyledTableRow tabIndex={-1}>
                        <TableBodyCell>
                          <IDAndImage>
                            <span>{selectedCampaign.id}</span>
                            <img
                              src={selectedCampaign.image}
                              alt={selectedCampaign.name}
                              height={50}
                            />
                          </IDAndImage>
                        </TableBodyCell>
                        <TableBodyCell>{selectedCampaign.name}</TableBodyCell>
                        <TableBodyCell>
                          {selectedCampaign.description}
                        </TableBodyCell>
                        <TableBodyCell>
                          <a href={selectedCampaign.url}>
                            {selectedCampaign.url}
                          </a>
                        </TableBodyCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
      <br />
      {!approved && (
        <WarningBanner onClick={() => handleApprove()} buttonText="Approve">
          <WarningContent>
            <b>Zesty Market isn&apos;t approved to use your USDC</b> Please
            approve to complete the order.
          </WarningContent>
        </WarningBanner>
      )}
      {confirmStatus === ConfirmStatus.NOT_ENOUGH_FUNDS && (
        <NotEnoughFunds
          onCancel={() => setConfirmStatus(ConfirmStatus.PENDING)}
        />
      )}
      <StyledButton
        onClick={confirm}
        disabled={
          !approved ||
          Object.keys(campaignPerFormat).length <
            Object.keys(groupedAuctions).length
        }
      >
        Confirm order
      </StyledButton>
      <Backdrop
        sx={{ color: `#fff`, zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};

export default ReviewOrderPage;
