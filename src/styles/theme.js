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
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: `linear-gradient(112.17deg, #F89724 0%, #E23F26 100%)`,
        },
        outlinedPrimary: {
          borderImageSlice: 5,
          borderImageSource: `linear-gradient(to right, #F89524, #E34126)`,
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
