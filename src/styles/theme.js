import { createTheme } from '@mui/material';

// todo: Font
export const theme = createTheme({
  palette: {
    primary: {
      main: `#F89C24`,
      contrastText: '#BDB9C8',
    },
    secondary: {
      main: `#8647D6`,
      contrastText: '#BDB9C8',
    },
    text: {
      primary: `#fff`,
      secondary: `#837C99`,
    },
    background: {
      default: `#181522`,
      paper: '#211c35',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: `linear-gradient(112.17deg, #F89724 0%, #E23F26 100%)`,
          '&.Mui-disabled': {
            color: '#fff',
            opacity: 0.6,
          },
        },
        outlinedPrimary: {
          borderColor: '#F89524',
          '&:hover': {
            backgroundColor: '#F8972480',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          borderRadius: 4,
          color: '#fff',
        },
        colorPrimary: {
          background: `linear-gradient(112.17deg, #F89724 0%, #E23F26 100%)`,
        },
        outlinedPrimary: {
          background: 'transparent',
          color: '#BDB9C8',
          borderColor: 'rgba(131, 124, 153, 0.4)',
        },
      },
    },
  },
});
