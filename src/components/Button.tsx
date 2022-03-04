import React from 'react';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

interface ButtonProps {
  outlined?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  color: theme.palette.text.primary,
  textTransform: `none`,
  fontSize: 14,
  fontWeight: 400,
  borderRadius: theme.spacing(1),
  '&.MuiButton-containedPrimary': {
    background: `linear-gradient(112.17deg, #F89724 0%, #E23F26 100%)`,
  },
  '&.MuiButton-outlinedPrimary': {
    borderImageSlice: 5,
    borderImageSource: `linear-gradient(to right, #F89524, #E34126)`,
  },
}));

const Button: React.FC<ButtonProps> = ({ outlined, children, onClick }) => {
  const variant = outlined ? `outlined` : `contained`;
  return (
    <StyledButton variant={variant} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
