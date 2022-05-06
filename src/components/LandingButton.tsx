import React from 'react';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

interface Props {
  outlined?: boolean;
  bold?: boolean;
  children: React.ReactNode;
  style?: any;
  onClick?: () => void;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== `bold` && prop !== `style`,
})<{ bold?: boolean }>(({ theme, bold, style }) => ({
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  textTransform: `none`,
  fontSize: 18,
  lineHeight: 22,
  fontWeight: bold ? 700 : 400,
  borderRadius: theme.spacing(1),
  height: 60,
  width: 150,
  ...style,
}));

const LandingButton: React.FC<Props> = ({
  outlined,
  bold,
  children,
  onClick,
  style,
  ...restProps
}) => {
  const variant = outlined ? `outlined` : `contained`;
  return (
    <StyledButton
      variant={variant}
      bold={bold}
      style={style}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
};

export default LandingButton;
