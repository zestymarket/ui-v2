import React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

interface Props {
  label: string;
  selected?: boolean;
}

const StyledTabLabel = styled(`div`)(({ theme }) => ({
  color: theme.palette.text.primary,
  cursor: `pointer`,
  fontSize: 18,
  marginRight: theme.spacing(2),
}));

const StyledDot = styled(`div`)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 26,
  position: `absolute`,
  top: theme.spacing(-1.5),
  right: 0,
}));

const HeaderTab: React.FC<Props> = ({ label, selected }) => (
  <Grid item display="flex" position="relative">
    <StyledTabLabel>{label}</StyledTabLabel>
    {selected && <StyledDot>•</StyledDot>}
  </Grid>
);

export default HeaderTab;
