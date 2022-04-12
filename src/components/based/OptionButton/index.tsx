import Button, { ButtonProps } from '@mui/material/Button';
import React, { FC } from 'react';
import cls from 'classnames';

import styles from './index.module.scss';

interface IOptionButton extends ButtonProps {
  selected: boolean;
  disabled?: boolean;
}

const OptionButton: FC<IOptionButton> = ({
  selected,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      className={cls(
        styles.button,
        { [styles.selected]: selected },
        { [styles.disabled]: disabled },
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default OptionButton;
