import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useMemo } from 'react';

/**
 * Tokens de design para glassmorphism
 */
export const glassTokens = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: 'rgba(15, 23, 42, 0.8)',
    glass: 'rgba(148, 163, 184, 0.1)',
    glassDark: 'rgba(30, 41, 59, 0.4)',
    glassLight: 'rgba(226, 232, 240, 0.05)',
    text: '#e2e8f0',
    textSecondary: '#cbd5e1',
  },
  backdrop: {
    blur: 'blur(16px)',
    filter: 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
  },
  glass: {
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(226, 232, 240, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
};

/**
 * Cria um tema MUI personalizado com efeito glassmorphism
 */
function createAppTheme() {
  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: glassTokens.colors.primary,
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: glassTokens.colors.secondary,
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      background: {
        default: glassTokens.colors.background,
        paper: glassTokens.colors.glass,
      },
      text: {
        primary: glassTokens.colors.text,
        secondary: glassTokens.colors.textSecondary,
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: `linear-gradient(135deg, ${glassTokens.colors.background} 0%, #1a1f35 100%)`,
            backgroundAttachment: 'fixed',
            overflow: 'hidden',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: `linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0%, rgba(30, 41, 59, 0.05) 100%)`,
            backdropFilter: glassTokens.backdrop.blur,
            WebkitBackdropFilter: glassTokens.backdrop.blur,
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '12px',
            backdropFilter: glassTokens.backdrop.blur,
            WebkitBackdropFilter: glassTokens.backdrop.blur,
            border: '1px solid rgba(226, 232, 240, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backdropFilter: `${glassTokens.backdrop.blur} brightness(1.1)`,
              WebkitBackdropFilter: `${glassTokens.backdrop.blur} brightness(1.1)`,
              border: '1px solid rgba(226, 232, 240, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px rgba(99, 102, 241, 0.2)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${glassTokens.colors.primary} 0%, ${glassTokens.colors.secondary} 100%)`,
            boxShadow: `0 8px 16px rgba(99, 102, 241, 0.3)`,
          },
          outlined: {
            borderColor: 'rgba(226, 232, 240, 0.3)',
            '&:hover': {
              borderColor: 'rgba(226, 232, 240, 0.5)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: `linear-gradient(135deg, rgba(148, 163, 184, 0.08) 0%, rgba(30, 41, 59, 0.08) 100%)`,
            backdropFilter: glassTokens.backdrop.blur,
            WebkitBackdropFilter: glassTokens.backdrop.blur,
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.15)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(226, 232, 240, 0.25)',
              boxShadow: '0 16px 48px rgba(99, 102, 241, 0.15)',
              transform: 'translateY(-4px)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: `linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)`,
            backdropFilter: glassTokens.backdrop.blur,
            WebkitBackdropFilter: glassTokens.backdrop.blur,
            borderBottom: '1px solid rgba(226, 232, 240, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de tema global com glassmorphism
 */
export function AppThemeProvider({ children }: ThemeProviderProps) {
  const theme = useMemo(() => createAppTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default createAppTheme;
