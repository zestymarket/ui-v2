import { styled } from '@mui/system';

export const ButtonGroup = styled(`div`)({
  display: `flex`,

  '& > button': {
    marginRight: 10,

    '&:last-child': {
      marginRight: 0,
    },
  },
});
