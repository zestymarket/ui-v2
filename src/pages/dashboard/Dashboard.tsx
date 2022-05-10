import TabsContainer from '@/components/TabsContainer';
import Overview from './components/Overview';

export default function Dashboard() {
  return (
    <div>
      <TabsContainer
        tabs={[
          {
            id: `overview`,
            label: `Overview`,
            PanelComponent: Overview,
          },
          {
            id: `account-management`,
            label: `Account Management`,
            PanelComponent: Overview,
          },
        ]}
      />
    </div>
  );
}
