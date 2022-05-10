import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Link, styled } from '@mui/material';

interface Props {
  label: string;
  to: string;
  highlighted?: boolean;
}

const StyledLink = styled(Link)({
  textDecoration: `none`,
});

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

const HeaderTab: React.FC<Props> = ({ label, to, highlighted }) => {
  const { pathname } = useRouter();
  const selected = to === pathname;
  return (
    <StyledLink href={to} passHref>
      <StyledTab
        item
        display="flex"
        position="relative"
        sx={{ backgroundColor: selected ? `#000000` : `transparent` }}
      >
        <StyledTabLabel>{label}</StyledTabLabel>
        {highlighted && <StyledDot>•</StyledDot>}
      </StyledTab>
    </StyledLink>
  );
};

export default HeaderTab;
