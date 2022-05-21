import { AUCTION_STATUS } from '@/utils/classes/Auction';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { TableBodyCell } from './styles';

export interface ICampaignCell {
  status: AUCTION_STATUS;
  campaignUris: any;
  id: number;
}

const AuctionDataCampaingCell: FC<ICampaignCell> = ({
  status,
  campaignUris,
  id,
}) => {
  const { chainId } = useWeb3React();
  const [name, setName] = useState<string>(`None`);

  useEffect(() => {
    if (campaignUris.has(id)) setName(campaignUris.get(id).name);
  }, [campaignUris, id]);

  return (
    <TableBodyCell align="left">
      {status === AUCTION_STATUS.awaiting_approval ||
      status === AUCTION_STATUS.active ||
      status === AUCTION_STATUS.bought ||
      status === AUCTION_STATUS.finished ? (
        <Link href={`/campaigns/${id}?chainId=${chainId}`} color="inherit">
          {name}
        </Link>
      ) : (
        `None`
      )}
    </TableBodyCell>
  );
};

export default AuctionDataCampaingCell;
