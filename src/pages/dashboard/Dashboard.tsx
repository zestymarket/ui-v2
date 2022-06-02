import TabsContainer from '@/components/TabsContainer';
import Overview from '@/components/dashboard/Overview';
import Account from '@/components/dashboard/Account';
import MySpaces from '@/components/dashboard/MySpaces';
import StyledDashboard from './styled';

export default function Dashboard() {
  return (
    <StyledDashboard>
      <TabsContainer
        title="Dashboard"
        tabs={[
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
