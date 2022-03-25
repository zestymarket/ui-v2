import { Switch, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';

interface Props {
  label: string;
  enabled: boolean;
  onToggle: (selected: boolean) => void;
}

const StyledSwitchWrapper = styled(`div`)({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
});

const StyledSwitch = styled(Switch)(({ theme }) => ({
  height: 54,
  width: 82,

  '& .MuiSwitch-switchBase': {
    padding: 18,
    backgroundColor: `transparent`,
    '&:hover': {
      backgroundColor: `transparent`,
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    transform: `translateX(28px)`,

    '& + .MuiSwitch-track': {
      backgroundColor: `transparent`,
      borderColor: theme.palette.primary.main,
    },

    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.text.secondary,
    width: 17,
    height: 17,
  },
  '& .MuiSwitch-track': {
    backgroundColor: `transparent`,
    borderWidth: 1,
    borderStyle: `solid`,
    borderColor: theme.palette.text.secondary,
    borderRadius: 27,
  },
}));

const ActiveSwitch: React.FC<Props> = ({ label, enabled, onToggle }) => {
  const onClick = () => onToggle(!enabled);

  return (
    <StyledSwitchWrapper>
      <Typography color="text.secondary">{label}</Typography>
      <StyledSwitch
        disableRipple
        disableFocusRipple
        disableTouchRipple
        checked={enabled}
        size="medium"
        onClick={onClick}
      />
    </StyledSwitchWrapper>
  );
};

export default ActiveSwitch;
