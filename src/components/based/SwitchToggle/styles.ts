import { Switch } from '@mui/material';
import { styled } from '@mui/system';

export const Wrapper = styled(`div`)({
  display: `flex`,
  alignItems: `center`,

  '& > label': {
    fontFamily: `Inter`,
    fontStyle: `normal`,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: `17px`,
    textAlign: `right`,
    color: `#837c99`,
    marginRight: 10,
  },
});

export const CustomSwitch = styled(Switch)({
  width: 58,
  height: 30,
  border: 0,
  boxSizing: `border-box`,
  borderRadius: 23,
  background: `transparent !important`,
  padding: 0,
  opacity: 1,

  '.MuiSwitch-switchBase': {
    padding: 0,
    margin: 7,
    transitionDuration: `0.3s`,
    background: `transparent`,

    '&.Mui-checked': {
      transform: `translateX(26px)`,
      color: `#837c99`,

      '& + .MuiSwitch-track': {
        background: `transparent`,
        opacity: 1,
        border: `1px solid #f89c24`,
      },

      '&..Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },

      '.MuiSwitch-thumb': {
        background: `#f89c24`,
      },
    },

    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: `#33cf4d`,
      border: `6px solid #fff`,
    },

    '&.Mui-disabled .MuiSwitch-thumb': {
      opacity: 0.5,
    },

    '&.Mui-disabled .MuiSwitch-track': {
      opacity: 0.3,
    },

    '& .MuiSwitch-thumb': {
      boxSizing: `border-box`,
      background: `#837c99`,
      width: 16,
      height: 16,
      transition: `all 0.3s`,
    },
  },

  '& .MuiSwitch-track': {
    background: `transparent`,
    transition: `all 0.3s`,
    border: `1px solid #5f5777`,
    borderRadius: 23,
    opacity: 1,
  },
});
