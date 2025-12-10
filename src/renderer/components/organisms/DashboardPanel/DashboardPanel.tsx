import { Box, Container } from '@mui/material';
import { Text } from '@components/atoms';
import { glassTokens } from '@theme/theme';
import '@shared/types/electron.d';

/**
 * Organism: DashboardPanel
 * Painel principal - layout limpo para conteúdo dinâmico
 */
export function DashboardPanel() {
  return (
    <Box
      sx={{
        width: '100%',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Text
            variant="h1"
            sx={{
              background: `linear-gradient(135deg, ${glassTokens.colors.primary} 0%, ${glassTokens.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Bem-vindo ao DTK
          </Text>
          <Text variant="subtitle1" sx={{ color: glassTokens.colors.textSecondary }}>
            Selecione uma opção no menu lateral para começar
          </Text>
        </Box>
      </Container>
    </Box>
  );
}

export default DashboardPanel;
