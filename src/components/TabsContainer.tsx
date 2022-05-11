import React from 'react';
import Image from 'next/image';
import { Stack, Tabs, Box, Typography, styled } from '@mui/material';
import MuiTab from '@mui/material/Tab';

interface TabContainerProps {
  title?: string;
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
    padding: 0,
    marginRight: theme.spacing(4),
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
    minWidth: 0,
  }),
);
const StyledRedirectIcon = styled(`div`)({
  marginLeft: 8,
});

const StyledTitleWrapper = styled(`div`)({
  maxWidth: 1400,
  width: `100%`,
  margin: `auto`,
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 60,
  lineHeight: `56px`,
  fontWeight: 700,
  letterSpacing: `-0.02em`,
  margin: theme.spacing(0, 0, 3),
}));

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
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

const StyledWrapper = styled(Stack)({
  margin: `auto`,
  width: `100%`,
});

const StyledTabHeader = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: 48,
  width: `100%`,
  margin: `auto`,
  maxWidth: 1400,
}));

const TabsContainer: React.FC<TabContainerProps> = ({ title, tabs }) => {
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
      {title && (
        <StyledTitleWrapper>
          <StyledTitle>{title}</StyledTitle>
        </StyledTitleWrapper>
      )}
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
