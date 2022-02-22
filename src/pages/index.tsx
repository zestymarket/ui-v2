import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Typography,
  Chip,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { keyframes } from '@mui/styled-engine';
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
import { FormatCategories, getCategoryFromFormat } from '@/utils/formats';
import { styled } from '@mui/system';
import SpaceData from '@/utils/SpaceData';

const format_options: Chip[] = [{ name: `All Formats` }];

Object.keys(FormatCategories).map((key, value) => {
  format_options.push({ name: key.split(` `)[0] });
});

const isChipNameInFormatOptions = (chipName: string) => {
  for (let i = 0; i < format_options.length; i++) {
    if (format_options[i].name === chipName) return true;
  }
  return false;
};

interface Chip {
  name: string;
}

const StyledChipList = styled(Paper)(({ theme }) => ({
  root: {
    display: `flex`,
    //justifyContent: "center",
    flexWrap: `wrap`,
    listStyle: `none`,
    padding: theme.spacing(0.5),
    margin: 0,
    backgroundColor: theme.palette.background.default,
  },
}));
const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));
const StyledCheckboxLabel = styled(FormControlLabel)({
  textAlign: `right`,
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
const discordButtonMovement = keyframes`
  from: {transform: "translateY(0px)"},
  to: {transform: "translateY(10px)"}
`;

const StyledDiscordButton = styled(`a`)({
  position: `fixed`,
  bottom: 10,
  right: 0,
  zIndex: 10,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
  flexWrap: `wrap`,
  height: 100,
  width: 100,
  borderRadius: `50%`,
  boxShadow: `0 3px 4px rgb(117 117 117 / 40%), 0px 2px 4px rgb(117 117 117 / 12%), 0px 1px 4px rgb(117 117 117 / 14%)`,
  backgroundColor: `#5865F2`,
  margin: `2em`,
  textDecoration: `none`,
  overflow: `hidden`,
  color: `white`,
  transition: `0.3s ease-in-out`,
  animationName: `${discordButtonMovement}`,
  animationIterationCount: `infinite`,
  animationDuration: `2s`,
  animationDirection: `alternate`,
  '&:hover': {
    animationName: ``,
    transform: `translateY(0) scale(1.1)`,
  },
  '@media (max-width: 960px)': {
    display: `none`,
  },
});

const Market = () => {
  const { chainId } = useWeb3React<Web3Provider>();
  const { query } = useRouter();
  const client = chainId ? getClient(chainId) : undefined;
  // const { showLoading, hideLoading } = useContext(LoadingContext);
  const [onlyShowActive, setOnlyShowActive] = useState<boolean>(true);
  const [marketData, setMarketData] = useState<SpaceData[]>([]);
  const [filteredMarketData, setFilteredMarketData] = useState<
    SpaceData[] | undefined[]
  >([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [sortedMarketData, setSortedMarketData] = useState<SpaceData[]>([]);
  const [selectedSort, setSelectedSort] = useState(`highest volume`);
  const [chipData, setChipData] = useState<Chip[]>([]);

  // query filtering
  const [skip, setSkip] = useState<number>(0);

  const { data, loading, error, fetchMore } = useQuery<
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

  useEffect(() => {
    if (query.verified) {
      // enqueueSnackbar(`Your email address has been successfully verified!`, {
      //   variant: `success`,
      // });
    }
  }, []);

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
        setMarketData(newMarketData);
      });
    }
  }, [data]);

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
    chipData.forEach((chip) => {
      if (isChipNameInFormatOptions(chip.name)) formats.push(chip.name);
    });

    let newFilteredMarketData = sortedMarketData;
    if (formats.length > 0) {
      newFilteredMarketData = newFilteredMarketData.filter((spaceData) =>
        formats.includes(getCategoryFromFormat(spaceData.format)),
      );
    }

    if (onlyShowActive) {
      newFilteredMarketData = newFilteredMarketData.filter(
        (spaceData) => spaceData.hasActiveAuctions,
      );
    }
    setFilteredMarketData(newFilteredMarketData);
  }, [sortedMarketData, chipData, onlyShowActive]);

  const handleSort = (chosen: Chip) => {
    setSelectedSort(chosen.name);
  };

  const handleOnlyActive = (
    _ev: React.ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => {
    setOnlyShowActive(value);
  };

  const handleNewChip = (chosen: Chip) => {
    let newChipData = chipData.length > 0 ? [...chipData] : [];

    if (chosen.name === `All Formats`) {
      newChipData = newChipData.filter(
        (chip) => !isChipNameInFormatOptions(chip.name),
      );
    } else {
      if (newChipData.includes(chosen)) {
        const index = newChipData.indexOf(chosen);
        newChipData.splice(index, 1);
      } else {
        newChipData.push(chosen);
      }
    }

    setChipData(newChipData);
  };

  const showMarketContent = () => {
    return filteredMarketData.map((spaceData, index) => {
      return (
        <Grid
          item
          xs
          key={spaceData?.id || index}
          sx={{ opacity: spaceData?.hasActiveAuctions ? 1 : 0.5 }}
        >
          {/* <SpaceCard spaceData={spaceData} />  */}
        </Grid>
      );
    });
  };

  const handleChipDelete = (index: number) => () => {
    const newChipData = chipData.length > 0 ? [...chipData] : [];
    newChipData.splice(index, 1);
    setChipData(newChipData);
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
      <Grid item>
        {/* component="ul" */}
        <StyledChipList elevation={0}>
          {chipData.map((chip, i) => (
            <li key={i}>
              <StyledChip
                label={chip.name}
                onDelete={handleChipDelete(i)}
                className={chip.name.toLowerCase()}
                variant="outlined"
              />
            </li>
          ))}
        </StyledChipList>
      </Grid>

      {/* <Grid item container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="subtitle2">
            {filteredMarketData.length || `-`} Space
            {filteredMarketData.length > 1 ? `s` : ``} Available
          </Typography>
        </Grid>

        <Grid item xs container justifyContent="flex-end">
          <StyledCheckboxLabel
            style={{ marginRight: 0 }}
            control={
              <Checkbox
                onChange={handleOnlyActive}
                checked={onlyShowActive}
                color="primary"
              />
            }
            label="Only show active"
          />
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

      <StyledSpaceCardContainer item container>
        {showMarketContent()}
      </StyledSpaceCardContainer>

      {/* <StyledDiscordButton href="https://discord.gg/hSXTGvAcSs"> */}
      {/* <DiscordIcon size={62} />  */}
      {/* </StyledDiscordButton> */}
    </Grid>
  );
};

export default Market;
