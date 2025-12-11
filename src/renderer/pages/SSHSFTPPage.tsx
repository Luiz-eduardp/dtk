import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { glassTokens } from '@theme/theme';
import { useSSHIpc, useSSHConnection } from '@hooks/index';
import { SSHConfigForm } from '@components/molecules';
import { CodeEditor, TerminalPanel } from '@components/organisms';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import type { SSHConfig, FileNode } from '@shared/types/ssh';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export function SSHSFTPPage() {
  const { getAllSSHConfigs, createSSHConfig, updateSSHConfig, deleteSSHConfig, loading, error } =
    useSSHIpc();
  const {
    connect,
    disconnect,
    executeCommand,
    listFiles,
    readFile,
    connected,
    loading: sshLoading,
    error: sshError,
  } = useSSHConnection();

  const [configs, setConfigs] = useState<SSHConfig[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SSHConfig | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<SSHConfig | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [editorValue, setEditorValue] = useState('');
  const [filesList, setFilesList] = useState<FileNode[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [commandOutput, setCommandOutput] = useState('');

  useEffect(() => {
    loadConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConfigs = async () => {
    try {
      const result = await getAllSSHConfigs();
      setConfigs(result || []);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    }
  };

  const handleCreateConfig = async (config: SSHConfig) => {
    try {
      await createSSHConfig(config);
      await loadConfigs();
      setOpenForm(false);
      setEditingConfig(null);
    } catch (err) {
      console.error('Erro ao criar configuração:', err);
    }
  };

  const handleUpdateConfig = async (id: string, config: Partial<SSHConfig>) => {
    try {
      await updateSSHConfig(id, config);
      await loadConfigs();
      setOpenForm(false);
      setEditingConfig(null);
    } catch (err) {
      console.error('Erro ao atualizar configuração:', err);
    }
  };

  const handleDeleteConfig = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteSSHConfig(id);
      await loadConfigs();
    } catch (err) {
      console.error('Erro ao deletar configuração:', err);
    }
  };

  const handleSelectConfig = useCallback(
    async (config: SSHConfig) => {
      setSelectedConfig(config);
      setSelectedFile(null);
      setEditorValue('');
      setCommandOutput('');

      try {
        if (config.id) {
          await connect(config.id);
          const files = await listFiles(config.id, '/');
          setFilesList(files);
        }
      } catch (err) {
        console.error('Erro ao conectar ao SSH:', err);
      }

      setTabValue(1);
    },
    [connect, listFiles]
  );

  const handleFileSelect = useCallback(
    async (file: FileNode) => {
      setSelectedFile(file);

      if (file.type === 'file' && selectedConfig?.id) {
        try {
          const fullPath = `${file.path}${file.path.endsWith('/') ? '' : '/'}${file.name}`;
          const content = await readFile(selectedConfig.id, fullPath);
          setEditorValue(content);
        } catch (err) {
          console.error('Erro ao ler arquivo:', err);
          setEditorValue(
            `Erro ao ler arquivo: ${err instanceof Error ? err.message : 'desconhecido'}`
          );
        }
      }
    },
    [selectedConfig, readFile]
  );

  const handleNavigateFolder = useCallback(
    async (file: FileNode) => {
      if (file.type === 'directory' && selectedConfig?.id) {
        try {
          const newPath = `${file.path}${file.path.endsWith('/') ? '' : '/'}${file.name}`;
          setCurrentPath(newPath);
          const files = await listFiles(selectedConfig.id, newPath);
          setFilesList(files);
          setSelectedFile(null);
          setEditorValue('');
        } catch (err) {
          console.error('Erro ao navegar pasta:', err);
        }
      }
    },
    [selectedConfig, listFiles]
  );

  const handleExecuteCommand = useCallback(
    async (cmd: string): Promise<string> => {
      if (!selectedConfig?.id) return '';

      try {
        const output = await executeCommand(selectedConfig.id, cmd);
        setCommandOutput(output);
        return output;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        const error = `Erro: ${errorMsg}`;
        setCommandOutput(error);
        return error;
      }
    },
    [selectedConfig, executeCommand]
  );

  const handleDisconnect = useCallback(async () => {
    if (selectedConfig?.id) {
      try {
        await disconnect(selectedConfig.id);
        setSelectedConfig(null);
        setSelectedFile(null);
        setEditorValue('');
        setFilesList([]);
        setCurrentPath('/');
        setCommandOutput('');
        setTabValue(0);
      } catch (err) {
        console.error('Erro ao desconectar:', err);
      }
    }
  }, [selectedConfig, disconnect]);

  const displayError = error || sshError;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(135deg, ${glassTokens.colors.background} 0%, #1a1f35 100%)`,
        backgroundAttachment: 'fixed',
        color: glassTokens.colors.text,
        p: 2,
      }}
    >
      {displayError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {displayError}
        </Alert>
      )}

      <Box
        sx={{
          borderBottom: glassTokens.glass.border,
          backgroundColor: glassTokens.glass.background,
          borderRadius: `${glassTokens.glass.borderRadius} ${glassTokens.glass.borderRadius} 0 0`,
          mb: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: glassTokens.colors.primary,
            },
            '& .MuiTab-root': {
              color: glassTokens.colors.textSecondary,
              '&.Mui-selected': {
                color: glassTokens.colors.primary,
              },
            },
          }}
        >
          <Tab label="Configurações" id="tab-0" />
          <Tab label="Conexão Ativa" id="tab-1" disabled={!selectedConfig} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingConfig(null);
              setOpenForm(true);
            }}
            sx={{
              background: `linear-gradient(135deg, ${glassTokens.colors.primary}, ${glassTokens.colors.secondary})`,
              alignSelf: 'flex-start',
            }}
          >
            Nova Configuração
          </Button>

          {loading || sshLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : configs.length > 0 ? (
            <List
              sx={{
                backgroundColor: glassTokens.glass.background,
                border: glassTokens.glass.border,
                borderRadius: glassTokens.glass.borderRadius,
              }}
            >
              {configs.map((config, index) => (
                <ListItem
                  key={config.id}
                  disablePadding
                  divider={index < configs.length - 1}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleSelectConfig(config)}
                        sx={{ color: glassTokens.colors.primary }}
                      >
                        Conectar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setEditingConfig(config);
                          setOpenForm(true);
                        }}
                        sx={{ color: glassTokens.colors.secondary }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteConfig(config.id)}
                        sx={{ color: '#f87171' }}
                      >
                        Deletar
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemButton disableRipple>
                    <ListItemText
                      primary={config.name}
                      secondary={`${config.username}@${config.host}:${config.port}`}
                      primaryTypographyProps={{
                        sx: { color: glassTokens.colors.text, fontWeight: 600 },
                      }}
                      secondaryTypographyProps={{
                        sx: { color: glassTokens.colors.textSecondary },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              sx={{ color: glassTokens.colors.textSecondary, textAlign: 'center', py: 4 }}
            >
              Nenhuma configuração SSH salva. Clique em {'"Nova Configuração"'} para criar uma.
            </Typography>
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {selectedConfig ? (
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 300px)', gap: 2 }}
          >
            <Card
              sx={{
                background: glassTokens.glass.background,
                border: glassTokens.glass.border,
                borderRadius: glassTokens.glass.borderRadius,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: glassTokens.colors.text }}>
                      {selectedConfig.name}
                    </Typography>
                    <Typography sx={{ color: glassTokens.colors.textSecondary, fontSize: '12px' }}>
                      {selectedConfig.username}@{selectedConfig.host}:{selectedConfig.port}
                    </Typography>
                  </Box>
                  <Chip
                    label={connected ? 'Conectado' : 'Desconectado'}
                    color={connected ? 'primary' : 'error'}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                  <Button
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={handleDisconnect}
                    sx={{ color: '#f87171' }}
                  >
                    Desconectar
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <Typography
                  sx={{ mb: 1, fontSize: '12px', color: glassTokens.colors.textSecondary }}
                >
                  Arquivos SFTP ({currentPath})
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: glassTokens.glass.background,
                    border: glassTokens.glass.border,
                    borderRadius: glassTokens.glass.borderRadius,
                    overflow: 'auto',
                    p: 1,
                  }}
                >
                  {sshLoading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <CircularProgress size={30} />
                    </Box>
                  ) : filesList.length > 0 ? (
                    <List disablePadding>
                      {filesList.map((file, idx) => (
                        <ListItem
                          key={`${file.path}-${file.name}-${idx}`}
                          disablePadding
                          sx={{
                            backgroundColor:
                              selectedFile?.name === file.name && selectedFile?.type === file.type
                                ? glassTokens.colors.primary
                                : 'transparent',
                            borderRadius: '4px',
                            mb: 0.5,
                            overflow: 'hidden',
                          }}
                        >
                          {file.type === 'directory' ? (
                            <ListItemButton
                              dense
                              onClick={() => handleNavigateFolder(file)}
                              sx={{
                                color: glassTokens.colors.secondary,
                                '&:hover': {
                                  backgroundColor: glassTokens.colors.secondary + '20',
                                },
                              }}
                            >
                              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                                📁 {file.name}
                              </Typography>
                            </ListItemButton>
                          ) : (
                            <ListItemButton
                              dense
                              onClick={() => handleFileSelect(file)}
                              sx={{
                                color: glassTokens.colors.text,
                                '&:hover': {
                                  backgroundColor: glassTokens.colors.primary + '20',
                                },
                              }}
                            >
                              <ListItemText
                                primary={file.name}
                                secondary={`${((file.size || 0) / 1024).toFixed(1)} KB`}
                                primaryTypographyProps={{
                                  sx: { fontSize: '13px', fontWeight: 500 },
                                }}
                                secondaryTypographyProps={{
                                  sx: { fontSize: '11px', color: glassTokens.colors.textSecondary },
                                }}
                              />
                            </ListItemButton>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography
                      sx={{ color: glassTokens.colors.textSecondary, textAlign: 'center', p: 2 }}
                    >
                      Nenhum arquivo encontrado
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={8}
                sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <Typography
                  sx={{ mb: 1, fontSize: '12px', color: glassTokens.colors.textSecondary }}
                >
                  {selectedFile
                    ? `Editando: ${selectedFile.name}`
                    : 'Selecione um arquivo para editar'}
                </Typography>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  {selectedFile ? (
                    <CodeEditor
                      value={editorValue}
                      onChange={setEditorValue}
                      language={getLanguageFromFilename(selectedFile.name)}
                      height="100%"
                    />
                  ) : (
                    <Card
                      sx={{
                        background: glassTokens.glass.background,
                        border: glassTokens.glass.border,
                        borderRadius: glassTokens.glass.borderRadius,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ color: glassTokens.colors.textSecondary }}>
                        Selecione um arquivo à esquerda para começar a editar
                      </Typography>
                    </Card>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '250px' }}>
              <Typography sx={{ mb: 1, fontSize: '12px', color: glassTokens.colors.textSecondary }}>
                Terminal SSH
              </Typography>
              <TerminalPanel commands={[]} onCommand={handleExecuteCommand} height="200px" />
              {commandOutput && (
                <Box
                  sx={{
                    backgroundColor: '#0a0e27',
                    color: '#00ff00',
                    p: 1,
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'Fira Code',
                    maxHeight: '100px',
                    overflow: 'auto',
                    mt: 1,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {commandOutput}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: glassTokens.colors.textSecondary, textAlign: 'center', py: 4 }}>
            Selecione uma configuração SSH para começar
          </Typography>
        )}
      </TabPanel>

      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingConfig(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: glassTokens.glass.background,
            border: glassTokens.glass.border,
            borderRadius: glassTokens.glass.borderRadius,
          },
        }}
      >
        <DialogTitle sx={{ color: glassTokens.colors.text }}>
          {editingConfig ? 'Editar Configuração' : 'Nova Configuração SSH'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <SSHConfigForm
            initialConfig={editingConfig || undefined}
            onSubmit={async (config) => {
              if (editingConfig?.id) {
                await handleUpdateConfig(editingConfig.id, config);
              } else {
                await handleCreateConfig(config);
              }
            }}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    html: 'html',
    css: 'css',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
  };
  return languageMap[ext] || 'javascript';
}
