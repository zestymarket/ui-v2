import { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EXPLORER_URLS, SUPPORTED_WALLETS } from '@/lib/wallet';
import { styled } from '@mui/system';
import { injected } from '@/utils/connectors';
import { Grid, Stack } from '@mui/material';
import Button from '@/components/Button';
import { formatPrice, formatUSDC, shortenHex } from '@/utils/helpers';
import { WalletConnectContext } from '@/components/Layout';
import { USDC_ABI, USDC_ADDRESS } from '@/lib/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import WalletBalance from './WalletBalance';
import Image from 'next/image';

declare let window: any;

const StyledWrapper = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const StyledAccount = styled(`div`)(({ theme }) => ({
  maxWidth: theme.spacing(100),
  margin: `auto`,
  padding: theme.spacing(4, 0),
  minHeight: 615,
}));

const StyledLink = styled(`a`)({});

const StyledRow = styled(Stack)(({ theme }) => ({
  flexDirection: `row`,
  justifyContent: `space-between`,
  alignItems: `center`,
  paddingBottom: theme.spacing(3),
  borderBottom: `solid 1px rgba(255, 255, 255, 0.1)`,
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)({
  background: `transparent`,
  border: `1px solid rgba(255, 255, 255, 0.16)`,
  display: `flex`,
  alignItems: `center`,
  lineHeight: `16px`,
});

const StyledImage = styled(`div`)({
  marginLeft: 20,
  width: 16,
  height: 16,
});

export default function Account() {
  const { chainId, account, connector, library } = useWeb3React();
  const [connectorName, setConnectorName] = useState(``);
  const [usdcBalance, setUsdcBalance] = useState(``);
  const [ethBalance, setEthBalance] = useState(``);
  const { onClickConnectWallet } = useContext(WalletConnectContext);

  useEffect(() => {
    const { ethereum } = window as any;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === `METAMASK`)),
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];

    setConnectorName(name);
  }, [connector]);

  useEffect(() => {
    async function fetchBalance() {
      const usdc = new Contract(USDC_ADDRESS[chainId || 4], USDC_ABI, library);
      const fetchedUsdcBalance: BigNumber = await usdc.balanceOf(account);
      setUsdcBalance(formatUSDC(fetchedUsdcBalance));

      const fetchedEthBalance: BigNumber = await library.getBalance(account);
      setEthBalance(formatPrice(fetchedEthBalance));
    }

    if (chainId && library) {
      fetchBalance();
    }
  }, [chainId, library, account]);

  const content = (
    <Stack flexDirection="column">
      <StyledRow>
        {connectorName} connected
        <Grid
          container
          item
          xs={8}
          justifyContent="flex-end"
          alignItems="center"
        >
          {account && account.length && (
            <CopyToClipboard text={account}>
              <StyledButton outlined onClick={() => null}>
                {account.endsWith(`.eth`) ? account : shortenHex(account, 4)}
                <StyledImage>
                  <Image
                    src="/icons/clipboard.svg"
                    width={16}
                    height={16}
                    alt="clipboard"
                  />
                </StyledImage>
              </StyledButton>
            </CopyToClipboard>
          )}
          <StyledLink
            href={EXPLORER_URLS[chainId || 4] + `/address/` + account}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button outlined onClick={() => null}>
              See on Explorer
            </Button>
          </StyledLink>
          <Button
            style={{ marginRight: 0 }}
            outlined
            onClick={onClickConnectWallet}
          >
            Change
          </Button>
        </Grid>
      </StyledRow>
      <StyledRow>
        Balances
        <Grid
          container
          item
          xs={8}
          justifyContent="flex-end"
          alignItems="center"
        >
          <WalletBalance
            icon={
              chainId === 4
                ? `/icons/currency/ethers.svg`
                : `/icons/currency/matic.svg`
            }
            name={chainId === 4 ? `ETH` : `MATIC`}
            value={ethBalance}
          />
          <WalletBalance
            icon="/icons/currency/usdc.svg"
            name="USDC"
            value={usdcBalance}
          />
        </Grid>
      </StyledRow>
    </Stack>
  );

  return (
    <StyledWrapper>
      <StyledAccount>{account ? content : `Not Connected`}</StyledAccount>
    </StyledWrapper>
  );
}
