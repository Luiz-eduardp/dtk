import { Box } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import { glassTokens } from '@theme/theme';

/**
 * Molecule: Header
 * Header customizado com glassmorphism
 */
export function Header() {
  return (
    <AppBar
      position="relative"
      sx={{
        backgroundImage: `linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)`,
        backdropFilter: glassTokens.backdrop.blur,
        WebkitBackdropFilter: glassTokens.backdrop.blur,
        borderBottom: `1px solid ${glassTokens.colors.glassLight}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${glassTokens.colors.primary} 0%, ${glassTokens.colors.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          DTK
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ fontSize: '0.875rem', color: glassTokens.colors.textSecondary }}>v0.0.1</Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
