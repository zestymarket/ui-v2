import React, { useState } from 'react';
import Button from './Button';
import DepositNFTPopup from './DepositNFTPopup';

const DepositNFT = () => {
  const [showPopup, setShowPopup] = useState(false);

  const onClosePopup = () => setShowPopup(false);
  const onDepositNFT = () => setShowPopup(true);

  return (
    <>
      <Button onClick={onDepositNFT}>Deposit NFT</Button>
      {showPopup && <DepositNFTPopup open onClose={onClosePopup} />}
    </>
  );
};

export default DepositNFT;
