import React, { FC } from 'react';

import { CustomButton, IOptionButton } from './styles';

const OptionButton: FC<IOptionButton> = ({
  selected = false,
  disabled = false,
  children,
  onClick,
}) => {
  return (
    <CustomButton selected={selected} disabled={disabled} onClick={onClick}>
      {children}
    </CustomButton>
  );
};

export default OptionButton;
