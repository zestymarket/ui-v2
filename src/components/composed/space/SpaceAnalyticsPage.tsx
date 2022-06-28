import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/styles';
import { getClient } from '../../../lib/graphql';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { GET_ANALYTICS_BY_ID } from '@/lib/queries';
import Line from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

import { MS_IN_DAY, SECONDS_IN_DAY } from '@/utils/timeConstants';
import { Web3Provider } from '@ethersproject/providers';
import {
  AssetContainer,
  AssetContainerAssetText,
  AssetContainerLabelText,
} from '@/pages/space/[id]';

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

const ClickableGridItem = styled(Grid)({
  '&:hover': {
    opacity: 0.8,
    cursor: `pointer`,
  },
});

export const StateHeader = styled(`div`)({
  fontFamily: `Inter`,
  textTransform: `none`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: `40px`,
  lineHeight: 0,
  textAlign: `center`,
});

interface Props {
  id: number;
}

const SpaceAnalyticsPage: React.FC<Props> = ({ id }) => {
  const theme = useTheme();

  const { chainId } = useWeb3React<Web3Provider>();
  const client = getClient(chainId || 137);

  const [activeDataType, setActiveDataType] = useState<string>(`Visits`);
  const [activeData, setActiveData] = useState<any>(undefined);
  const [rawAnalyticsObject, setRawAnalyticsObject] = useState<any>(undefined);
  const [visitsData, setVisitsData] = useState<any>(undefined);
  const [clicksData, setClicksData] = useState<any>(undefined);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<number>(7);
  const [internalTimeframe, setInternalTimeframe] = useState(7);

  const secondary = theme.palette.secondary.main;
  const secondaryRGBA = hex2rgba(secondary, 1.0);
  const secondaryRGBA_07 = hex2rgba(secondary, 0.7);
  const primary = theme.palette.primary.main;
  const primaryRGBA = hex2rgba(primary, 1.0);
  const primaryRGBA_07 = hex2rgba(primary, 0.7);

  const { data, loading, error } = useQuery(GET_ANALYTICS_BY_ID, {
    context: {
      clientName: `beacon`,
    },
    variables: {
      timeframe: timeframe,
      id: id,
    },
    fetchPolicy: `cache-and-network`,
  });

  useEffect(() => {
    if (!loading && !error && data) {
      // Don't set load failed for clicks as some spaces do not support clicks
      // If there are no visits there will be no clicks, however, the opposite is not true
      if (!data || data.space.analytics.visits.length === 0) {
        setLoadFailed(true);
      } else {
        setRawAnalyticsObject(data.space.analytics);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (rawAnalyticsObject) {
      const rawVisits = [...rawAnalyticsObject?.visits];
      const rawClicks = [...rawAnalyticsObject?.clicks];

      if (rawVisits) {
        rawVisits.reverse();
        const visits_selected_keys = Object.keys(rawVisits);
        const visits_sorted_data = visits_selected_keys.map(
          (key: any) => rawVisits[key].count,
        );

        const newVisitsData = {
          labels: visits_selected_keys.map((key: any) =>
            new Date(rawVisits[key].date).toLocaleDateString(),
          ),
          datasets: [
            {
              label: `visits`,
              backgroundColor: primaryRGBA_07,
              borderColor: primaryRGBA,
              data: visits_sorted_data,
            },
          ],
        };

        const newTotalVisits =
          visits_sorted_data.length > 0
            ? visits_sorted_data.reduce((a, b) => a + b)
            : 0;

        setTotalVisits(newTotalVisits);
        setVisitsData(newVisitsData);
      }

      if (rawClicks) {
        rawClicks.reverse();
        const clicks_selected_keys = Object.keys(rawClicks);
        const clicks_sorted_data = clicks_selected_keys.map(
          (key: any) => rawClicks[key].count,
        );

        const newClicksData = {
          labels: clicks_selected_keys.map((key: any) =>
            new Date(rawClicks[key].date).toLocaleDateString(),
          ),
          datasets: [
            {
              label: `clicks`,
              backgroundColor: secondaryRGBA_07,
              borderColor: secondaryRGBA,
              data: clicks_sorted_data,
            },
          ],
        };

        const newTotalClicks =
          clicks_sorted_data.length > 0
            ? clicks_sorted_data.reduce((a, b) => a + b)
            : 0;

        setTotalClicks(newTotalClicks);
        setClicksData(newClicksData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAnalyticsObject]);

  useEffect(() => {
    if (activeDataType === `Visits`) setActiveData(visitsData);
    else if (activeDataType === `Clicks`) setActiveData(clicksData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDataType, visitsData, clicksData]);

  useEffect(() => {
    setInternalTimeframe(timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeData]);

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

            if (internalTimeframe === 30) {
              if (value % 4 !== 0) return;
              return this.getLabelForValue(value);
            } else if (internalTimeframe === 365) {
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
  };

  if (loadFailed) {
    return <StateHeader>No data available for this space</StateHeader>;
  }

  if (!activeData) {
    return <StateHeader>Loading Data...</StateHeader>;
  }

  return (
    <>
      <Card
        style={{
          padding: `.5em`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CardMedia>
          <Grid container justifyContent="space-between" alignItems="center">
            <Title>{activeDataType}</Title>
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
      <Grid container pt={4} justifyContent="space-between" spacing={2}>
        <ClickableGridItem
          onClick={() => {
            setActiveDataType(`Visits`);
          }}
          item
          xs={12}
          md={6}
        >
          <AssetContainer flexDirection="column" justifyContent="center">
            <AssetContainerLabelText>Visits</AssetContainerLabelText>
            <AssetContainerAssetText>
              {totalVisits.toLocaleString()}
            </AssetContainerAssetText>
          </AssetContainer>
        </ClickableGridItem>
        <ClickableGridItem
          onClick={() => {
            setActiveDataType(`Clicks`);
          }}
          item
          xs={12}
          md={6}
        >
          <AssetContainer flexDirection="column" justifyContent="center">
            <AssetContainerLabelText>Clicks</AssetContainerLabelText>
            <AssetContainerAssetText>
              {totalClicks.toLocaleString()}
            </AssetContainerAssetText>
          </AssetContainer>
        </ClickableGridItem>
      </Grid>
    </>
  );
};

export default SpaceAnalyticsPage;
