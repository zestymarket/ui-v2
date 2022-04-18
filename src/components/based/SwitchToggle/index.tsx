import React, { FC } from 'react';
import { SwitchProps } from '@mui/material/Switch';

import { CustomSwitch, Wrapper } from './styles';

interface ISwitchToggle extends SwitchProps {
  label?: string;
}

const SwitchToggle: FC<ISwitchToggle> = ({ label = `` }) => {
  return (
    <Wrapper>
      {!!label && <label>{label}</label>}
      <CustomSwitch />
    </Wrapper>
  );
};

export default SwitchToggle;
