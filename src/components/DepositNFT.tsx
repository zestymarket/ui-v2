import React, { useState } from 'react';
import Button from './Button';
import DepositNFTPopup from './DepositNFTPopup';
interface DepositNFTProps {
  spaceId: number;
}

const DepositNFT: React.FC<DepositNFTProps> = ({ spaceId }) => {
  const [showPopup, setShowPopup] = useState(false);

  const onClosePopup = () => setShowPopup(false);
  const onDepositNFT = () => setShowPopup(true);

  return (
    <>
      <Button onClick={onDepositNFT}>Deposit NFT</Button>
      {showPopup && (
        <DepositNFTPopup spaceId={spaceId} open onClose={onClosePopup} />
      )}
    </>
  );
};

export default DepositNFT;
