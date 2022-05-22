import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { GET_ACTIVE_SPACES } from '@/lib/queries';
import { getClient } from '@/lib/graphql';
import throttle from 'lodash.throttle';
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
import Sort, { SORT } from '@/components/Sort';
import LoadingBar from 'react-top-loading-bar';

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
let lastScrollTop = 0;
const PAGE_LIMIT = 100;
let timeout = -1;
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
  const [selectedSort, setSelectedSort] = useState<SORT>(SORT.HIGHEST_VOLUME);
  const [selectedFilters, setSelectedFilters] = useState<FormatOption[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  // query filtering
  const [skip, setSkip] = useState<number>(0);

  const { data, loading, error } = useQuery<
    SellerNFTSettingQuery,
    SellerNFTSettingVars | TokenDataVars
  >(GET_ACTIVE_SPACES, {
    variables: {
      first: PAGE_LIMIT,
      skip: skip,
      cancelled: false,
      burned: false,
      // timeNow: parseInt((new Date().valueOf() / 1000).toFixed(0)),
      timeNow: 0,
    },
    fetchPolicy: `network-only`,
    // onCompleted: hideLoading
    onCompleted: () => undefined,
    onError: () => setLoadingMore(false),
    client: client,
  });

  const handleScroll = async () => {
    if (
      window.pageYOffset + window.innerHeight >=
      document.documentElement.scrollHeight - 10
    ) {
      const scrollTop = document.documentElement.scrollTop;
      if (lastScrollTop && scrollTop < lastScrollTop) return;
      lastScrollTop = scrollTop;
      if (loadingMore) return;
      setSkip(skip + PAGE_LIMIT);
      setLoadingMore(true);
      timeout = window.setTimeout(() => setLoadingMore(false), 5000);
    }
  };

  const throttledHandler = throttle(handleScroll, 500, { leading: true });

  useEffect(() => {
    // if (loadingData) return;
    window.addEventListener(`scroll`, throttledHandler);
    return () => window.removeEventListener(`scroll`, throttledHandler);
  }, []);

  // useEffect(() => {
  //   if (query.verified) {
  //     enqueueSnackbar(`Your email address has been successfully verified!`, {
  //       variant: `success`,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    window.clearTimeout(timeout);
    if (loading == false && !error && data) {
      const aggregateMarketData: SpaceData[] = marketData.slice();
      const array = data.sellerNFTSettings || [];
      if (!array.length) setLoadingMore(false);
      Promise.all(
        array.map(async (setting) => {
          const tokenData: TokenData = { ...setting.tokenData };

          if (tokenData.burned === true) return;
          tokenData.sellerNFTSetting = setting;

          const url = formatIpfsUri(tokenData.uri);

          try {
            const uri = await (await fetch(url)).json();
            const spaceData = new SpaceData(tokenData, uri);

            aggregateMarketData.push(spaceData);
          } catch {}
        }),
      ).then(() => {
        setLoadingData(false);
        setMarketData(aggregateMarketData);
        setLoadingMore(false);
      });
    }
  }, [data, error, loading]);

  useEffect(() => {
    const newSortedData = [...marketData];

    if (selectedSort === SORT.LOWEST_PRICE) {
      newSortedData.sort((a, b) => {
        const a_price = getLowestAuctionPrice(a.auctions);
        const b_price = getLowestAuctionPrice(b.auctions);
        return a_price - b_price;
      });
    } else if (selectedSort === SORT.ENDING_SOON) {
      newSortedData.sort((a, b) => {
        const a_time = getLowestAuctionEndTime(a.auctions);
        const b_time = getLowestAuctionEndTime(b.auctions);
        return a_time - b_time;
      });
    } else if (selectedSort === SORT.HIGHEST_VOLUME) {
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
    return <p>{`An error has occured while fetching`}</p>;
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{ maxWidth: `1400px`, margin: `auto` }}
    >
      <LoadingBar progress={loadingMore ? 50 : 100} />
      <StyledHeader
        item
        container
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={4}>
          <FormatFilters
            selectedFilters={selectedFilters}
            onSetFilters={setSelectedFilters}
          />
        </Grid>
        <Grid
          item
          xs={8}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <ActiveSwitch
            label="Only active"
            enabled={onlyShowActive}
            onToggle={setOnlyShowActive}
          />
          <Sort selectedSort={selectedSort} onChangeSort={setSelectedSort} />
        </Grid>
      </StyledHeader>
      <StyledSpaceCardContainer item container>
        {showMarketContent()}
      </StyledSpaceCardContainer>
    </Grid>
  );
};

export default Market;
