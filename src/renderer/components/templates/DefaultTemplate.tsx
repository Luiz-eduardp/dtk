/**
 * Template de página padrão
 */

import { Box, Container, BoxProps } from '@mui/material';
import { Header } from '@components/molecules';

interface DefaultTemplateProps extends BoxProps {
  children?: React.ReactNode;
}

export function DefaultTemplate({ children, ...props }: DefaultTemplateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
      {...props}
    >
      <Header />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

export default DefaultTemplate;
