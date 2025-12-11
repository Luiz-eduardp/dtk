import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import { glassTokens } from '@theme/theme';
import type { SSHConfig } from '@shared/types/ssh';

interface SSHConfigFormProps {
  initialConfig?: SSHConfig;
  onSave?: (config: SSHConfig) => Promise<void>;
  onSubmit?: (config: SSHConfig) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const SSHConfigForm: React.FC<SSHConfigFormProps> = ({
  initialConfig,
  onSave,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [config, setConfig] = useState<SSHConfig>(
    initialConfig || {
      name: '',
      host: '',
      port: 22,
      username: '',
      password: '',
      description: '',
    }
  );

  const [usePrivateKey, setUsePrivateKey] = useState(!!initialConfig?.privateKeyPath);

  const handleChange =
    (field: keyof SSHConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setConfig((prev: SSHConfig) => ({
        ...prev,
        [field]: field === 'port' ? parseInt(value, 10) : value,
      }));
    };

  const handleSave = async () => {
    try {
      const handler = onSubmit || onSave;
      if (handler) {
        await handler(config);
      }
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: glassTokens.glass.borderRadius,
        background: glassTokens.glass.background,
        border: glassTokens.glass.border,
        backdropFilter: glassTokens.backdrop.blur,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Nome da Configuração"
          value={config.name}
          onChange={handleChange('name')}
          disabled={loading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: glassTokens.colors.text,
              '& fieldset': {
                borderColor: glassTokens.colors.glass,
              },
              '&:hover fieldset': {
                borderColor: glassTokens.colors.primary,
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: glassTokens.colors.textSecondary,
              opacity: 0.7,
            },
          }}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Host"
            value={config.host}
            onChange={handleChange('host')}
            disabled={loading}
            placeholder="exemplo.com ou 192.168.1.1"
            variant="outlined"
          />
          <TextField
            label="Port"
            type="number"
            value={config.port}
            onChange={handleChange('port')}
            disabled={loading}
            sx={{ width: 120 }}
            variant="outlined"
          />
        </Stack>

        <TextField
          fullWidth
          label="Usuário"
          value={config.username}
          onChange={handleChange('username')}
          disabled={loading}
          variant="outlined"
        />

        {!usePrivateKey && (
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={config.password || ''}
            onChange={handleChange('password')}
            disabled={loading}
            variant="outlined"
          />
        )}

        <FormControlLabel
          control={
            <Switch
              checked={usePrivateKey}
              onChange={(e) => setUsePrivateKey(e.target.checked)}
              disabled={loading}
            />
          }
          label="Usar chave privada SSH"
        />

        {usePrivateKey && (
          <>
            <TextField
              fullWidth
              label="Caminho da chave privada"
              value={config.privateKeyPath || ''}
              onChange={handleChange('privateKeyPath')}
              disabled={loading}
              placeholder="/home/usuario/.ssh/id_rsa"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Passphrase (se necessário)"
              type="password"
              value={config.passphrase || ''}
              onChange={handleChange('passphrase')}
              disabled={loading}
              variant="outlined"
            />
          </>
        )}

        <TextField
          fullWidth
          label="Descrição"
          value={config.description || ''}
          onChange={handleChange('description')}
          disabled={loading}
          multiline
          rows={2}
          variant="outlined"
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            onClick={() => onCancel?.()}
            disabled={loading}
            sx={{
              color: glassTokens.colors.textSecondary,
              '&:hover': {
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !config.name || !config.host || !config.username}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${glassTokens.colors.primary}, ${glassTokens.colors.secondary})`,
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
