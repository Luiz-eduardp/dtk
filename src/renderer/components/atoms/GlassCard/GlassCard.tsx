import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material';
import { glassTokens } from '@theme/theme';

/**
 * Atom: GlassCard
 * Card com efeito glassmorphism reutilizável
 */
const GlassCardRoot = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg, ${glassTokens.colors.glass} 0%, rgba(30, 41, 59, 0.08) 100%)`,
  backdropFilter: glassTokens.backdrop.blur,
  WebkitBackdropFilter: glassTokens.backdrop.blur,
  borderRadius: '20px',
  border: `1px solid ${glassTokens.colors.glassLight}`,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  padding: theme?.spacing(3) || 3,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    border: `1px solid rgba(226, 232, 240, 0.25)`,
    boxShadow: `0 16px 48px rgba(99, 102, 241, 0.15)`,
    transform: 'translateY(-4px)',
  },
}));

interface GlassCardProps extends BoxProps {
  children?: React.ReactNode;
  elevated?: boolean;
}

export function GlassCard({ ...props }: GlassCardProps) {
  return <GlassCardRoot {...props} />;
}

export default GlassCard;
