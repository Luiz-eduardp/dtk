import { useState } from 'react';
import { Box } from '@mui/material';
import { Header } from '@components/molecules';
import { DashboardPanel, Sidebar } from '@components/organisms';
import { glassTokens } from '@theme/theme';

/**
 * Componente App principal
 * Define o layout e a estrutura geral da aplicação
 */
export function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(135deg, ${glassTokens.colors.background} 0%, #1a1f35 100%)`,
        backgroundAttachment: 'fixed',
        color: glassTokens.colors.text,
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Layout com Sidebar */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar */}
        <Sidebar onNavigate={setCurrentSection} />

        {/* Conteúdo principal */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {currentSection === 'dashboard' && <DashboardPanel />}
          {/* Próximas seções serão adicionadas aqui */}
          {!['dashboard'].includes(currentSection) && (
            <Box sx={{ p: 3 }}>
              <h2>Seção: {currentSection}</h2>
              <p>Conteúdo para {currentSection} será implementado em breve</p>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
