import { createTheme, ThemeOptions } from '@mui/material/styles';
import Colors from './colors';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    sml: true;
    tb: true;
    md: true;
    mdl: true;
    mlg: true;
    lg: true;
    xl: true;
  }
  interface TypographyVariants {
    main1: React.CSSProperties;
    main2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    main1?: React.CSSProperties;
    main2?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    main1: true;
    main2: true;
  }
}

let theme = createTheme({});

const themeOptions: ThemeOptions = {
  typography: {
    h2: {
      fontSize: '2rem',
      lineHeight: '3rem',
      [theme.breakpoints.down('md')]: {
        fontWeight: 500,
        fontSize: '1.5rem',
        lineHeight: '2rem',
      },
    },
    h3: {
      color: Colors.MIDNIGHT_BLUE,
      textAlign: 'center',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: '4rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
        lineHeight: '2.5rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
        lineHeight: '2rem',
      },
      '&::after': {
        content: '""',
        background: Colors.PRIMARY_MAIN,
        display: 'block',
        position: 'relative',
        width: '70px',
        height: '3px',
        zIndex: 1,
        margin: '0 auto',
        marginTop: '10px',
        marginBottom: '-5px',
        borderRadius: '5px',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      textAlign: 'center',
      [theme.breakpoints.down('md')]: {
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '1rem',
      },
    },
    main1: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: '2.5rem',
      [theme.breakpoints.down('mdl')]: {
        fontSize: '1.5rem',
        lineHeight: '2rem',
      },
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
        lineHeight: '1.5rem',
      },
      [theme.breakpoints.down('tb')]: {
        fontSize: '1rem',
        lineHeight: '1.25rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
    main2: {
      fontWeight: 400,
      fontSize: '1.15rem',
      lineHeight: '1.5rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        lineHeight: '1.25rem',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '0.75rem',
      },
    },
  },
  palette: {
    primary: {
      main: Colors.PRIMARY_MAIN,
      contrastText: Colors.PRIMARY_CONTR_TEXT,
    },
    secondary: {
      main: Colors.SECONDARY_MAIN,
      contrastText: Colors.SECONDARY_CONTR_TEXT,
    },
  },
  breakpoints: {
    values: {
      xxs: 320,
      xs: 391,
      sm: 500,
      sml: 600,
      tb: 768,
      md: 835,
      mdl: 900,
      mlg: 1000,
      lg: 1200,
      xl: 1400,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          paddingLeft: 15,
          paddingRight: 15,
          [theme.breakpoints.up('sm')]: {
            paddingLeft: 30,
            paddingRight: 30,
          },
          [theme.breakpoints.up('md')]: {
            paddingLeft: 40,
            paddingRight: 40,
          },
          [theme.breakpoints.up('lg')]: {
            maxWidth: 1800,
            paddingLeft: 50,
            paddingRight: 50,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '1rem',
          color: Colors.PRIMARY_DARK,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          boxShadow: Colors.TABLE_BORDER_SHADOW,
          '&.Mui-readOnly': {
            boxShadow: 'none',
            pointerEvents: 'none',
          },
        },
      },
    },
  },
};

theme = createTheme(themeOptions);

export default theme;
