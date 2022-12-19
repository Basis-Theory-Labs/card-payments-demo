import type { CSSProperties } from 'react';
import type {} from '@mui/lab/themeAugmentation';
import { alpha, createTheme } from '@mui/material';
import type { ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    code: CSSProperties;
  }

  interface TypographyVariantsOptions {
    code?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    code: true;
  }
}

const blissDarkOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    text: {
      primary: '#EBEDFF',
      secondary: '#8086A0',
    },
    background: {
      default: '#070A1B',
      paper: '#070A1B',
    },
    divider: alpha('#D1D7FF', 0.15),
    primary: {
      main: '#00D2EF',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: {
      fontFamily: "'Outfit', sans-serif",
    },
    h6: {
      fontFamily: "'Outfit', sans-serif",
    },
    subtitle1: {
      fontWeight: '600',
    },
    subtitle2: {},
    code: {
      fontFamily: "'Source Code Pro', monospace",
      fontSize: '12px',
      fontWeight: '600',
    },
    button: {},
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'inherit',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'inherit',
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
};

const yourApplicationOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#00A0BC',
    },
    background: {
      paper: '#F9F9FF',
    },
    grey: {
      '50': '#E5E9FF',
      '100': '#EDF0FF',
      '200': '#EAEDFF',
      '300': '#C4C8E0',
      '400': '#76798D',
      '500': '#606376',
      '800': '#1D2032',
    },
  },
  typography: blissDarkOptions.typography,
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.grey['50'],
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'inherit',
        },
      },
    },
  },
};

const blissDark = createTheme(blissDarkOptions);
const yourApplication = createTheme(yourApplicationOptions);

export { blissDarkOptions, blissDark, yourApplication, yourApplicationOptions };
