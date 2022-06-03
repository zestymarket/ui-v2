import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, Select, MenuItem } from '@mui/material';
import { styled, useTheme } from '@mui/styles';
import { getClient } from '../../../lib/graphql';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { GET_AUCTION_BY_NFT } from '../../../lib/queries';
import Line from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

import { MS_IN_DAY, SECONDS_IN_DAY } from '@/utils/timeConstants';
import { AUCTION_STATUS, getAuctionStatus } from '@/utils/classes/Auction';
import { SellerAuction } from '@/lib/types';

export const Title = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: 18,
  lineHeight: `24px`,
  letterSpacing: `-0.02em`,

  color: `#BDB9C8`,
});

const hex2rgba = (hex: string, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [
    255, 255, 255,
  ];
  return `rgba(${r},${g},${b},${alpha})`;
};

const timeframeOptions = [
  { name: `Past Year`, days: 365 },
  { name: `Past Month`, days: 30 },
  { name: `Past Week`, days: 7 },
];

function wasAuctionActive(auction: any, time: number) {
  const start = Number(auction.contractTimeStart) * 1000;
  const end = Number(auction.contractTimeEnd) * 1000;

  if (time >= start && time <= end) return true;

  return false;
}

const StyledSelect = styled(Select)({
  width: 200,
  height: 40,
  '& fieldset': {
    borderColor: `#ffffff30`,
    borderRadius: 8,
  },
  '& svg': {
    fill: `#ffffff30`,
  },
});

interface Props {
  id: number;
}

const SpaceHistoricalChart: React.FC<Props> = ({ id }) => {
  const theme = useTheme();

  const { chainId } = useWeb3React();
  const client = getClient(chainId || 137);

  const [activeData, setActiveData] = useState<any>(undefined);
  const [timeframe, setTimeframe] = useState(30);

  const secondary = theme.palette.secondary.main;
  const secondaryRGBA = hex2rgba(secondary, 1.0);
  // const secondaryLight = theme.palette.secondary.light;
  // const secondaryLightRGBA = secondaryLight
  //   .replace(/rgb/i, `rgba`)
  //   .replace(/\)/i, `,0.7)`);
  const primary = theme.palette.primary.main;
  const primaryRGBA = hex2rgba(primary, 1.0);
  // const primaryLight = theme.palette.primary.light;
  // const primaryLightRGBA = primaryLight
  //   .replace(/rgb/i, `rgba`)
  //   .replace(/\)/i, `,0.5)`);

  const { data, loading, error } = useQuery(GET_AUCTION_BY_NFT, {
    variables: {
      id: id,
      first: 512,
    },
    fetchPolicy: `network-only`,
    client: client,
  });

  useEffect(() => {
    if (loading == false && !error && data) {
      if (!data.sellerNFTSetting) return;
      const sellerAuctions = data.sellerNFTSetting.sellerAuctions;

      const filteredAuctions = sellerAuctions.filter(
        (auction: SellerAuction) =>
          getAuctionStatus(auction) === AUCTION_STATUS.finished,
      );

      const newAuctions = filteredAuctions.map((auction: SellerAuction) => {
        const length =
          (Number(auction.contractTimeEnd) -
            Number(auction.contractTimeStart)) /
          SECONDS_IN_DAY;
        const price = Number(auction.priceEnd) / 10 ** 6;
        const rate = price / length;

        const obj = { ...auction };
        obj.rate = rate;

        return obj;
      });

      const newLabels = [];
      const newData = [];
      const averageData = [];
      let totalPrice = 0;
      let totalDays = 0;
      const currentTime = new Date().getTime();

      for (let i = timeframe; i > 0; i--) {
        const day = currentTime - i * MS_IN_DAY;
        const activeAuction = newAuctions.find(
          (auction: SellerAuction) => wasAuctionActive(auction, day) === true,
        );
        if (!activeAuction) {
          newData.push(0);
        } else {
          newData.push(activeAuction.rate);

          totalPrice += activeAuction.rate;
          totalDays += 1;
        }

        averageData.push(totalDays > 0 ? totalPrice / totalDays : 0);
        newLabels.push(new Date(day).toLocaleDateString());
      }

      const newPriceData = {
        labels: newLabels,
        datasets: [
          {
            label: `PRICE`,
            borderColor: primaryRGBA,
            data: newData,
          },
          {
            label: `AVERAGE PRICE`,
            borderColor: secondaryRGBA,
            data: averageData,
          },
        ],
      };

      setActiveData(newPriceData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, timeframe]);

  // const width = window.innerWidth;
  // const height = window.innerHeight;

  const getChartData = () => {
    if (!activeData) return { datasets: [] };

    return activeData;
  };

  const getChoices = () => {
    let index = 0;
    return timeframeOptions.map((timeframe: any) => {
      return (
        <MenuItem key={index++} value={timeframe.days}>
          {timeframe.name}
        </MenuItem>
      );
    });
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: `bottom`,
        labels: {
          padding: 20,
          color: `#837C99`,
          font: {
            family: `Inter`,
            weight: `600`,
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: `#FFFFFF1A`,
          drawTicks: false,
        },
        ticks: {
          color: `#837C99`,
          font: {
            family: `Inter`,
            weight: `600`,
            size: 12,
          },
          padding: 8,
          precision: 1,
        },
      },
      x: {
        grid: {
          color: `#FFFFFF1A`,
          drawTicks: false,
        },
        ticks: {
          color: `#837C99`,
          padding: 16,
          font: {
            family: `Inter`,
            weight: `600`,
            size: 12,
          },
          callback: function (value: any): any {
            if (isNaN(value)) return;

            if (timeframe === 30) {
              if (value % 4 !== 0) return;
              return this.getLabelForValue(value);
            } else if (timeframe === 365) {
              if (value % 24 !== 0) return;
              return this.getLabelForValue(value);
            } else {
              return this.getLabelForValue(value);
            }
          },
        },
      },
    },
  };

  const handleSelectedTimeframe = (e: any) => {
    setTimeframe(e.target.value);
    console.log(`selected`, e.target.value);
  };

  return (
    <Card
      style={{
        padding: `.5em`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CardMedia>
        <Grid container justifyContent="space-between" alignItems="center">
          <Title>Historical Prices</Title>
          <StyledSelect value={timeframe} onChange={handleSelectedTimeframe}>
            {getChoices()}
          </StyledSelect>
        </Grid>
        <div
          style={{
            position: `relative`,
            margin: `auto`,
            height: 600,
          }}
        >
          <Line
            options={options}
            data={getChartData}
            type="line"
            height={undefined}
            width={undefined}
          />
        </div>
      </CardMedia>
    </Card>
  );
};

export default SpaceHistoricalChart;
