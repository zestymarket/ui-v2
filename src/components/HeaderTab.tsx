import React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

interface Props {
  label: string;
  selected?: boolean;
  highlighted?: boolean;
}

const StyledTab = styled(Grid)(({ theme }) => ({
  borderRadius: 30,
  padding: `${theme.spacing()} ${theme.spacing(2)}`,
}));

const StyledTabLabel = styled(`div`)(({ theme }) => ({
  color: theme.palette.text.primary,
  cursor: `pointer`,
  fontSize: 18,
}));

const StyledDot = styled(`div`)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 26,
  position: `absolute`,
  top: theme.spacing(-1.5),
  right: 0,
}));

const HeaderTab: React.FC<Props> = ({ label, selected, highlighted }) => (
  <StyledTab
    item
    display="flex"
    position="relative"
    sx={{ backgroundColor: selected ? `#000000` : `transparent` }}
  >
    <StyledTabLabel>{label}</StyledTabLabel>
    {highlighted && <StyledDot>•</StyledDot>}
  </StyledTab>
);

export default HeaderTab;
