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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useSelector } from 'react-redux';
import { PageContext } from '../lib/context/page';
import { RootState } from '../lib/redux/rootReducer';
import { TableBodyCell } from '@/components/based/AuctionDataTable/styles';
import {
  DataTableHead,
  stableSort,
  getComparator,
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
import { formatIpfsUri } from '@/utils/helpers';
import CampaignData from '@/utils/classes/CampaignData';
import { styled } from '@mui/material';
import { useZestyMarketUSDC, useUSDC } from '@/utils/hooks';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { useSnackbar } from 'notistack';
import WarningBanner from '@/components/WarningBanner';
import Button from '@/components/Button';
import _ from 'lodash';

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
  font-weight: 700;
`;

const NEW_CAMPAIGN_OBJ = {
  id: ``,
  name: `+ New Campaign`,
  description: ``,
  url: ``,
  image: ``,
} as unknown as CampaignData;

const ReviewOrderPage = () => {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const { setPageName } = React.useContext(PageContext);
  const [order, setOrder] = useState<Order>(`asc`);
  const [orderBy, setOrderBy] = useState<keyof AuctionData>(`id`);
  const [approved, setApproved] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const auctions = useSelector(
    (state: RootState) => state.auctionBasketReducer.auctions,
  );
  const zestyMarketUSDC = useZestyMarketUSDC(true);
  const contractUSDC = useUSDC(true);
  const total = auctions.reduce((sum, auction) => (sum += auction.price), 0);
  const [campaignPerFormat, setCampaignPerFormat] = useState<
    Record<string, any>
  >({});
  contractUSDC
    .allowance(account, zestyMarketUSDC?.address)
    .then((allowance: BigNumber) => {
      if (
        allowance.gte(BigNumber.from((total * 10 ** 6).toFixed(0).toString()))
      ) {
        setApproved(true);
      }
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
  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{ maxWidth: `1400px`, margin: `auto` }}
    >
      <h2>Space Details</h2>
      {Object.entries(groupedAuctions).map(([format, rows]) => {
        const total = rows.reduce((sum, auction) => (sum += auction.price), 0);
        const filteredCampaigns = userCampaigns.filter(
          (campaign) =>
            convertOldFormats(campaign.format) === convertOldFormats(format),
        );
        filteredCampaigns.unshift(NEW_CAMPAIGN_OBJ);
        const selectedCampaign = campaignPerFormat[format];
        return (
          <Accordion key={format} defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              color="blue"
            >
              <h4>{format}</h4>
            </AccordionSummary>
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
                    {stableSort(rows, getComparator(order, orderBy)).map(
                      (row, index) => {
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
                              {row.contractStartTime}
                            </TableBodyCell>
                            <TableBodyCell align="left">{`${row.duration}`}</TableBodyCell>
                            <TableBodyCell align="left">{`${
                              (row as any).spaceName
                            }`}</TableBodyCell>
                            <TableBodyCell align="left">
                              <b>{row.price.toFixed(2)}</b>USDC
                            </TableBodyCell>
                          </StyledTableRow>
                        );
                      },
                    )}
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
                onChange={(e) =>
                  setCampaignPerFormat({
                    ...campaignPerFormat,
                    [format]: JSON.parse(e.target.value as string),
                  })
                }
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
      <StyledButton disabled={!approved} onClick={() => null}>
        Confirm order
      </StyledButton>
    </Grid>
  );
};

export default ReviewOrderPage;
