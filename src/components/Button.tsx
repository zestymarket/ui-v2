import React from 'react';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

interface Props {
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
  height: 40,
}));

const Button: React.FC<Props> = ({
  outlined,
  children,
  onClick,
  ...restProps
}) => {
  const variant = outlined ? `outlined` : `contained`;
  return (
    <StyledButton variant={variant} onClick={onClick} {...restProps}>
      {children}
    </StyledButton>
  );
};

export default Button;
