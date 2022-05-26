import TabsContainer from '@/components/TabsContainer';
import Overview from './components/Overview';
import Account from './components/Account';
import StyledDashboard from './styled';
import MySpaces from './components/MySpaces';

export default function Dashboard() {
  return (
    <StyledDashboard>
      <TabsContainer
        title="Dashboard"
        tabs={[
          {
            id: `overview`,
            label: `Overview`,
            PanelComponent: Overview,
          },
          {
            id: `my-spaces`,
            label: `My Spaces`,
            PanelComponent: MySpaces,
          },
          {
            id: `my-campaigns`,
            label: `My Campaigns`,
            PanelComponent: Overview,
          },
          {
            id: `notifications`,
            label: `Notifications`,
            PanelComponent: Overview,
          },
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
