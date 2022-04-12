import React, { FC } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';

import styles from './index.module.scss';

interface ISwitchToggle extends SwitchProps {
  label?: string;
}

const SwitchToggle: FC<ISwitchToggle> = ({ label = ``, ...props }) => {
  return (
    <div className={styles.wrapper}>
      {!!label && <label>{label}</label>}
      <Switch className={styles.switch} disableRipple {...props} />
    </div>
  );
};

export default SwitchToggle;
