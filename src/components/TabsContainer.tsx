import React from 'react';
import Image from 'next/image';
import { Stack, Tabs, Box } from '@mui/material';
import MuiTab from '@mui/material/Tab';
import { styled } from '@mui/system';

interface TabContainerProps {
  tabs: TabProps[];
}

interface TabProps {
  label: string;
  id: string;
  link?: string;
  PanelComponent: React.ElementType;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const StyledTab = styled(MuiTab)<TabProps & { hasLink: boolean }>(
  ({ theme, hasLink }) => ({
    color: theme.palette.primary.contrastText,
    fontSize: 18,
    fontWeight: 400,
    opacity: hasLink ? 0.5 : 1,
    textTransform: `none`,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  }),
);
const StyledRedirectIcon = styled(`div`)({
  marginLeft: 8,
});

const Tab: React.FC<TabProps> = (props: TabProps) => {
  let iconProps = {};
  if (props.link) {
    iconProps = {
      icon: (
        <StyledRedirectIcon>
          <Image src="/icons/redirect.svg" alt="logo" width={10} height={10} />
        </StyledRedirectIcon>
      ),
      iconPosition: `end`,
    };
  }

  return <StyledTab {...props} hasLink={!!props.link} {...iconProps} />;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`panel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const StyledWrapper = styled(Stack)({
  maxWidth: 1400,
  margin: `auto`,
  width: `100%`,
});

const StyledTabHeader = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: 64,
  width: `100%`,
}));

const TabsContainer: React.FC<TabContainerProps> = ({ tabs }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const tabLink = (event as React.ChangeEvent).target.getAttribute(
      `data-link`,
    );
    if (!!tabLink) {
      window.open(tabLink);
    } else {
      setValue(newValue);
    }
  };

  return (
    <StyledWrapper flexDirection="column">
      <StyledTabHeader flexDirection="row">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((tab) => (
            <Tab {...tab} key={tab.id} data-link={tab.link} />
          ))}
        </Tabs>
      </StyledTabHeader>
      {tabs.map(({ id, PanelComponent }, index) => (
        <TabPanel key={id} value={value} index={index}>
          <PanelComponent />
        </TabPanel>
      ))}
    </StyledWrapper>
  );
};

export default TabsContainer;
