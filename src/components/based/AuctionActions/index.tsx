import React from 'react';
import { styled } from '@mui/material';
import Image from 'next/image';
import { AUCTION_STATUS } from '@/utils/classes/Auction';
import { AuctionData } from '../AuctionDataTable';
import { useSnackbar } from 'notistack';
import { useZestyMarketUSDC } from '@/utils/hooks';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';

const Wrapper = styled(`div`)`
  height: 180px;
  padding: 16px 40px 16px 16px;
  border: 2px solid #f89524;
  background: #13101e;
  position: fixed;
  right: -30px;
  top: 20%;
  border-radius: 16px 0 0 16px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  z-index: 1;
`;

const Button = styled(`button`)`
  width: 40px;
  height: 40px;
  background: linear-gradient(112.17deg, #f89724 0%, #e23f26 100%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin-top: -11px;
  margin-bottom: -10.5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

interface Props {
  auctions: AuctionData[];
  clearSelectedAuctions: any;
}

const AuctionActions: React.FC<Props> = ({
  auctions,
  clearSelectedAuctions,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { account } = useWeb3React<Web3Provider>();
  const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const zestyMarketUSDC = account ? useZestyMarketUSDC(true) : undefined;

  if (!auctions?.length) return <></>;

  const isCancellable = auctions.every((auction) => {
    return auction.status === AUCTION_STATUS.no_bids;
  });

  const isApprovable = auctions.every((auction) => {
    return auction.status === AUCTION_STATUS.awaiting_approval;
  });

  function handleApprove() {
    if (!zestyMarketUSDC) return;

    let didError = false;
    auctions.forEach((row) => {
      if (row.status !== AUCTION_STATUS.awaiting_approval) {
        enqueueSnackbar(`Auction is not awaiting approval`, {
          variant: `error`,
        });
        didError = true;
      }
    });

    if (didError === false) {
      const ids = auctions.map((auction) => Number(auction.id));
      const plural = ids.length > 1 ? `s` : ``;

      zestyMarketUSDC
        .sellerAuctionApproveBatch(ids)
        .then((res: any) => {
          enqueueSnackbar(`Transaction pending...`, {
            variant: `info`,
            autoHideDuration: 15000,
          });
          res
            .wait()
            .then(() => {
              enqueueSnackbar(`Successfully approved campaign${plural}`, {
                variant: `success`,
              });
              clearSelectedAuctions();
              router.reload();
            })
            .catch((e: Error) => {
              enqueueSnackbar(e.message, {
                variant: `error`,
              });
            });
        })
        .catch((e: Error) => {
          enqueueSnackbar(e.message, {
            variant: `error`,
          });
        });
    }
  }

  function handleReject() {
    if (!zestyMarketUSDC) return;

    const didError = false;
    auctions.forEach((auction) => {
      if (auction.status !== AUCTION_STATUS.awaiting_approval) {
        enqueueSnackbar(`Auction is not awaiting approval`, {
          variant: `error`,
        });
      }
    });

    if (didError === false) {
      const ids = auctions.map((auction) => Number(auction.id));
      const plural = ids.length > 1 ? `s` : ``;

      zestyMarketUSDC
        .sellerAuctionRejectBatch(ids)
        .then((res: any) => {
          enqueueSnackbar(`Transaction pending...`, {
            variant: `info`,
            autoHideDuration: 15000,
          });
          res
            .wait()
            .then(() => {
              enqueueSnackbar(`Successfully rejected buyer${plural}`, {
                variant: `success`,
              });
              clearSelectedAuctions();
              router.reload();
            })
            .catch((e: Error) => {
              enqueueSnackbar(e.message, {
                variant: `error`,
              });
            });
        })
        .catch((e: Error) => {
          enqueueSnackbar(e.message, {
            variant: `error`,
          });
        });
    }
  }

  function handleCancel() {
    if (!zestyMarketUSDC) return;

    let didError = false;
    auctions.forEach((auction) => {
      if (auction.status === AUCTION_STATUS.awaiting_approval) {
        enqueueSnackbar(
          `Cannot cancel an auction that is awaiting approval. Reject the campaign before cancelling.`,
          {
            variant: `error`,
          },
        );
        didError = true;
      }
    });

    if (didError === false) {
      const ids = auctions.map((auction) => Number(auction.id));
      const plural = ids.length > 1 ? `s` : ``;

      zestyMarketUSDC
        .sellerAuctionCancelBatch(ids)
        .then((res: any) => {
          enqueueSnackbar(`Transaction pending...`, {
            variant: `info`,
            autoHideDuration: 15000,
          });
          res
            .wait()
            .then(() => {
              enqueueSnackbar(`Successfully cancelled auction${plural}`, {
                variant: `success`,
              });
              clearSelectedAuctions();
              router.reload();
            })
            .catch((e: Error) => {
              enqueueSnackbar(e.message, {
                variant: `error`,
              });
            });
        })
        .catch((e: Error) => {
          enqueueSnackbar(e.message, {
            variant: `error`,
          });
        });
    }
  }

  return (
    <Wrapper>
      <Button disabled={isCancellable} onClick={handleApprove}>
        <Image src="/icons/check-mark.svg" alt="cart" height={16} width={16} />
      </Button>
      <Button disabled={isCancellable} onClick={handleReject}>
        <Image src="/icons/cross.svg" alt="cart" height={16} width={16} />
      </Button>
      <Button disabled={isApprovable} onClick={handleCancel}>
        <Image src="/icons/trash.svg" alt="cart" height={16} width={16} />
      </Button>
    </Wrapper>
  );
};

export default AuctionActions;
