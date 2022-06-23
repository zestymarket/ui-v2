import { Stack } from '@mui/material';
import { styled } from '@mui/system';
import Head from 'next/head';

const StyledCard = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(),
  backgroundColor: theme.palette.background.default,
  height: theme.spacing(24),
  padding: theme.spacing(2),
  marginRight: theme.spacing(3),
  width: theme.spacing(36),
}));

const StyledTitle = styled(`label`)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.contrastText,
}));

const StyledAmount = styled(`div`)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: `flex`,
  fontSize: 48,
  fontWeight: 700,
  flexGrow: 1,
  alignItems: `center`,
  justifyContent: `center`,
}));
const StyledUpDown = styled(`label`)(({ theme }) => ({
  display: `none`,
}));

interface CardProps {
  title: string;
  amount: number;
  upDownValue?: string;
}
const FundCard: React.FC<CardProps> = ({ title, amount = 0, upDownValue }) => {
  const amtValue = `$${amount.toFixed(2)}`;
  return (
    <StyledCard>
      <StyledTitle>{title}</StyledTitle>
      <StyledAmount>{amtValue}</StyledAmount>
      {upDownValue && <StyledUpDown>upDownValue</StyledUpDown>}
    </StyledCard>
  );
};

const StyledOverview = styled(`div`)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Header = styled(`header`)({
  maxWidth: `1400px`,
  margin: `0 auto`,
});

const H1 = styled(`h1`)({
  fontWeight: 700,
  fontSize: `26px`,
  letterSpace: -0.02,
});

const StyledCards = styled(Stack)({
  maxWidth: `1400px`,
  margin: `0 auto`,
});

interface OverviewProps {
  totalReceived: number;
  totalSent: number;
  totalPending: number;
  totalClaimable: number;
}

const FundCards: React.FC<OverviewProps> = ({
  totalReceived,
  totalSent,
  totalPending,
  totalClaimable,
}) => {
  return (
    <StyledOverview>
      <StyledCards direction="row">
        <FundCard title="Total Revenue" amount={totalReceived} />
        <FundCard title="Total Spent" amount={totalSent} />
        <FundCard title="Pending" amount={totalPending} />
        <FundCard title="Claimable" amount={totalClaimable} />
      </StyledCards>
    </StyledOverview>
  );
};

export default FundCards;
