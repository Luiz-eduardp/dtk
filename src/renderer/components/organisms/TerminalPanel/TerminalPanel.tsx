import React, { useEffect, useRef } from 'react';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';
import { glassTokens } from '@theme/theme';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  error?: string;
}

interface TerminalPanelProps {
  commands?: TerminalCommand[];
  onCommand?: (command: string) => Promise<string>;
  loading?: boolean;
  height?: string | number;
}

/**
 * Componente Terminal para executar comandos via SSH
 */
export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  commands = [],
  onCommand,
  loading = false,
  height = '300px',
}) => {
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState<TerminalCommand[]>(commands);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleExecute = async () => {
    if (!input.trim() || !onCommand) return;

    const command = input.trim();

    try {
      const output = await onCommand(command);
      const newCommand: TerminalCommand = {
        id: `cmd_${Date.now()}`,
        command,
        output,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [...prev, newCommand]);
      setInput('');
      setHistoryIndex(-1);
    } catch (error) {
      const newCommand: TerminalCommand = {
        id: `cmd_${Date.now()}`,
        command,
        output: '',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
      setHistory((prev) => [...prev, newCommand]);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleClear = () => {
    setHistory([]);
    setInput('');
    setHistoryIndex(-1);
  };

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: glassTokens.glass.borderRadius,
        background: glassTokens.glass.background,
        border: glassTokens.glass.border,
        overflow: 'hidden',
      }}
    >
      {/* Output */}
      <Box
        ref={outputRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          fontFamily: "'Fira Code', 'Monaco', monospace",
          fontSize: '12px',
          backgroundColor: '#1e1e1e',
          borderBottom: glassTokens.glass.border,
        }}
      >
        {history.map((cmd) => (
          <Box key={cmd.id} sx={{ mb: 1.5 }}>
            <Typography
              component="div"
              sx={{
                color: glassTokens.colors.primary,
                fontSize: '12px',
                mb: 0.5,
              }}
            >
              $ {cmd.command}
            </Typography>
            {cmd.error ? (
              <Typography
                component="div"
                sx={{
                  color: '#f87171',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                Error: {cmd.error}
              </Typography>
            ) : (
              <Typography
                component="div"
                sx={{
                  color: glassTokens.colors.text,
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {cmd.output || '(sem saída)'}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Digite um comando..."
          size="small"
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: glassTokens.colors.text,
              fontFamily: "'Fira Code', 'Monaco', monospace",
              fontSize: '12px',
            },
          }}
        />
        <Button
          onClick={handleExecute}
          disabled={loading || !input.trim()}
          variant="contained"
          size="small"
          sx={{
            background: `linear-gradient(135deg, ${glassTokens.colors.primary}, ${glassTokens.colors.secondary})`,
            minWidth: 'auto',
          }}
        >
          <SendIcon sx={{ fontSize: '18px' }} />
        </Button>
        <Button
          onClick={handleClear}
          disabled={loading}
          size="small"
          sx={{
            color: glassTokens.colors.textSecondary,
            '&:hover': {
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
            },
            minWidth: 'auto',
          }}
        >
          <ClearIcon sx={{ fontSize: '18px' }} />
        </Button>
      </Stack>
    </Box>
  );
};
