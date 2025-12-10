import { Box } from '@mui/material';
import { Text, GlassCard, Button } from '@components/atoms';
import { glassTokens } from '@theme/theme';

/**
 * Molecule: InfoCard
 * Card informativo com conteúdo e ação
 */
interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function InfoCard({ title, description, icon, action }: InfoCardProps) {
  return (
    <GlassCard
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
      }}
    >
      {icon && (
        <Box
          sx={{
            fontSize: '2.5rem',
            color: glassTokens.colors.primary,
          }}
        >
          {icon}
        </Box>
      )}

      <Text variant="h3" sx={{ fontWeight: 600 }}>
        {title}
      </Text>

      <Text variant="body2" sx={{ color: glassTokens.colors.textSecondary, flex: 1 }}>
        {description}
      </Text>

      {action && (
        <Button variant="contained" onClick={action.onClick} fullWidth>
          {action.label}
        </Button>
      )}
    </GlassCard>
  );
}

export default InfoCard;
