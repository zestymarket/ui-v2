import TabsContainer from '@/components/TabsContainer';
// import Overview from './components/Overview';
import Account from './components/Account';
import StyledDashboard from './styled';

export default function Dashboard() {
  return (
    <StyledDashboard>
      <TabsContainer
        title="Dashboard"
        tabs={[
          // {
          //   id: `overview`,
          //   label: `Overview`,
          //   PanelComponent: Overview,
          // },
          {
            id: `account-management`,
            label: `Account Management`,
            PanelComponent: Account,
          },
        ]}
      />
    </StyledDashboard>
  );
}
