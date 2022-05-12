import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

export interface IOptionButton {
  selected?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick: () => void;
}

export const CustomButton = styled(Button)<IOptionButton>(
  ({ selected, disabled }) => ({
    border: selected ? `transparent` : `1px solid rgba(131, 124, 153, 0.4)`,
    boxSizing: `border-box`,
    borderRadius: selected ? 4 : 19,
    fontFamily: `Inter`,
    fontStyle: `normal`,
    fontWeight: selected ? 500 : 700,
    fontSize: 12,
    lineHeight: `15px`,
    display: `flex`,
    alignItems: `center`,
    textAlign: `center`,
    letterSpacing: `0.02em`,
    textTtransform: `uppercase`,
    transition: `all 0.3s`,
    color: selected ? `white` : `#837c99 !important`,
    padding: `7px 14px`,
    background: selected
      ? `linear-gradient(112.17deg, #f89724, #e23f26)`
      : `initial`,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? `none` : `initial`,
  }),
);
