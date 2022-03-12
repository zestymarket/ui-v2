import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { GET_ACTIVE_SPACES } from '@/lib/queries';
import { getClient } from '@/lib/graphql';
import {
  SellerNFTSettingQuery,
  SellerNFTSettingVars,
  TokenData,
  TokenDataVars,
} from '@/lib/types';
import {
  formatIpfsUri,
  getLowestAuctionEndTime,
  getLowestAuctionPrice,
  hasOpenAuction,
} from '@/utils/helpers';
import { getCategoryFromFormat, SpaceFormats } from '@/utils/formats';
import SpaceData from '@/utils/SpaceData';
import SpaceCard from '@/components/SpaceCard';
import FormatFilters, {
  FormatOption,
  isFilterNameInFormatOptions,
} from '@/components/FormatFilters';
import ActiveSwitch from '@/components/ActiveSwitch';

const skeletonData = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];

const StyledHeader = styled(Grid)({
  padding: `10px 50px`,
});

const StyledSpaceCardContainer = styled(Grid)({
  display: `grid`,
  gridTemplateColumns: `minmax(0,1fr)`,
  gridGap: `12px`,
  justifyContent: `center`,
  '@media (min-width: 600px)': {
    gridTemplateColumns: `repeat(2,1fr)`,
    gridGap: `16px`,
  },
  '@media (min-width: 1160px)': {
    gridTemplateColumns: `repeat(3,1fr)`,
  },
  '@media (min-width: 1400px)': {
    gridTemplateColumns: `repeat(4,1fr)`,
    gridGap: `32px`,
  },
});

const Market = () => {
  const { chainId } = useWeb3React<Web3Provider>();
  // const { query } = useRouter();
  const client = chainId ? getClient(chainId) : undefined;
  // const { showLoading, hideLoading } = useContext(LoadingContext);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [onlyShowActive, setOnlyShowActive] = useState<boolean>(true);
  const [marketData, setMarketData] = useState<SpaceData[]>([]);
  const [filteredMarketData, setFilteredMarketData] = useState<SpaceData[]>([]);
  const [sortedMarketData, setSortedMarketData] = useState<SpaceData[]>([]);
  const [selectedSort] = useState(`highest volume`);
  const [selectedFilters, setSelectedFilters] = useState<FormatOption[]>([]);

  // query filtering
  const [skip] = useState<number>(0);

  const { data, loading, error } = useQuery<
    SellerNFTSettingQuery,
    SellerNFTSettingVars | TokenDataVars
  >(GET_ACTIVE_SPACES, {
    variables: {
      first: 100,
      skip: skip,
      cancelled: false,
      burned: false,
      // timeNow: parseInt((new Date().valueOf() / 1000).toFixed(0)),
      timeNow: 0,
    },
    fetchPolicy: `network-only`,
    // onCompleted: hideLoading
    onCompleted: () => undefined,
    client: client,
  });

  // useEffect(() => {
  //   if (query.verified) {
  //     enqueueSnackbar(`Your email address has been successfully verified!`, {
  //       variant: `success`,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (loading == false && !error && data) {
      const newMarketData: SpaceData[] = [];

      Promise.all(
        (data.sellerNFTSettings || []).map(async (setting) => {
          const tokenData: TokenData = { ...setting.tokenData };

          if (tokenData.burned === true) return;
          tokenData.sellerNFTSetting = setting;

          const url = formatIpfsUri(tokenData.uri);

          try {
            const uri = await (await fetch(url)).json();
            const spaceData = new SpaceData(tokenData, uri);

            newMarketData.push(spaceData);
          } catch {}
        }),
      ).then(() => {
        setLoadingData(false);
        setMarketData(newMarketData);
      });
    }
  }, [data, error, loading]);

  useEffect(() => {
    const newSortedData = [...marketData];

    if (selectedSort === `lowest price`) {
      newSortedData.sort((a, b) => {
        const a_price = getLowestAuctionPrice(a.auctions);
        const b_price = getLowestAuctionPrice(b.auctions);
        return a_price - b_price;
      });
    } else if (selectedSort === `ending soon`) {
      newSortedData.sort((a, b) => {
        const a_time = getLowestAuctionEndTime(a.auctions);
        const b_time = getLowestAuctionEndTime(b.auctions);
        return a_time - b_time;
      });
    } else if (selectedSort === `highest volume`) {
      newSortedData.sort((a, b) => {
        const a_vol = a.volume;
        const b_vol = b.volume;
        return b_vol - a_vol;
      });
    }

    newSortedData.sort((a, b) => {
      a.hasActiveAuctions = hasOpenAuction(a.auctions);
      b.hasActiveAuctions = hasOpenAuction(b.auctions);
      return a.hasActiveAuctions === b.hasActiveAuctions
        ? 0
        : a.hasActiveAuctions
        ? -1
        : 1;
    });

    setSortedMarketData(newSortedData);
  }, [selectedSort, marketData]);

  useEffect(() => {
    const formats: string[] = [];
    selectedFilters.forEach((filter) => {
      // todo: needed?
      if (isFilterNameInFormatOptions(filter)) formats.push(filter);
    });

    let newFilteredMarketData = sortedMarketData;
    if (formats.length > 0) {
      newFilteredMarketData = newFilteredMarketData.filter(
        (spaceData) =>
          spaceData &&
          formats.includes(
            getCategoryFromFormat(spaceData.format as SpaceFormats),
          ),
      );
    }

    if (onlyShowActive) {
      newFilteredMarketData = newFilteredMarketData.filter(
        (spaceData) => spaceData && spaceData.hasActiveAuctions,
      );
    }

    setFilteredMarketData(newFilteredMarketData);
  }, [sortedMarketData, selectedFilters, onlyShowActive]);

  // const handleSort = (chosen: Chip) => {
  //   setSelectedSort(chosen.name);
  // };

  const showMarketContent = () => {
    if (loadingData) {
      return skeletonData.map((d, index) => (
        <Grid item xs key={index}>
          <SpaceCard spaceData={d} />
        </Grid>
      ));
    }

    return filteredMarketData.map((spaceData, index) => {
      return (
        <Grid
          item
          xs
          key={spaceData?.id || index}
          sx={{ opacity: spaceData?.hasActiveAuctions ? 1 : 0.5 }}
        >
          <SpaceCard spaceData={spaceData} />
        </Grid>
      );
    });
  };

  if (error) {
    console.log(error);
    return <p>{error}</p>;
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{ maxWidth: `1400px`, margin: `auto` }}
    >
      {/* <Grid item container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="subtitle2">
            {filteredMarketData.length || `-`} Space
            {filteredMarketData.length > 1 ? `s` : ``} Available
          </Typography>
        </Grid>

        <Grid item xs container justifyContent="flex-end">
          <Grid container justifyContent="flex-end" alignItems="center">
            <Typography variant="subtitle2">Sort by</Typography>
            <SimpleListMenu
              options={sort_options}
              outputSelected={handleSort}
            />
          </Grid>
        </Grid>
      </Grid>
      */}

      <StyledHeader item container>
        <FormatFilters
          selectedFilters={selectedFilters}
          onSetFilters={setSelectedFilters}
        />
        <ActiveSwitch
          label="Only active"
          enabled={onlyShowActive}
          onToggle={setOnlyShowActive}
        />
      </StyledHeader>
      <StyledSpaceCardContainer item container>
        {showMarketContent()}
      </StyledSpaceCardContainer>
    </Grid>
  );
};

export default Market;
