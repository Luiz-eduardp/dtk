import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import { glassTokens } from '@theme/theme';
import type { FileNode } from '@shared/types/ssh';

interface FileExplorerProps {
  files?: FileNode[];
  onSelect?: (file: FileNode) => void;
  onRefresh?: () => Promise<void>;
  basePath?: string;
  loading?: boolean;
}

/**
 * Explorador de arquivos para navegação SFTP
 */
export const FileExplorer: React.FC<FileExplorerProps> = ({
  files = [],
  onSelect,
  onRefresh,
  basePath = '/',
  loading = false,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: glassTokens.glass.borderRadius,
        background: glassTokens.glass.background,
        border: glassTokens.glass.border,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderBottom: glassTokens.glass.border }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Filtrar arquivos..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          disabled={loading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: glassTokens.colors.text,
            },
          }}
        />
        <Button
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{
            color: glassTokens.colors.primary,
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
            minWidth: 'auto',
          }}
        >
          {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
        </Button>
      </Stack>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          fontSize: '12px',
        }}
      >
        <Typography sx={{ p: 1, fontSize: '11px', color: glassTokens.colors.textSecondary }}>
          {basePath}
        </Typography>

        {filteredFiles.length > 0 ? (
          <List sx={{ p: 0 }}>
            {filteredFiles.map((file) => (
              <ListItem
                key={`${file.path}/${file.name}`}
                disablePadding
                onClick={() => file.type === 'file' && onSelect?.(file)}
                sx={{
                  cursor: file.type === 'file' ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                  },
                }}
              >
                <ListItemButton sx={{ py: 0.5, px: 1 }}>
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    {file.type === 'directory' ? (
                      <FolderIcon sx={{ fontSize: '18px', color: glassTokens.colors.primary }} />
                    ) : (
                      <InsertDriveFileIcon
                        sx={{ fontSize: '18px', color: glassTokens.colors.secondary }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      file.type === 'file'
                        ? `${(file.size || 0) / 1024 > 1024 ? ((file.size || 0) / 1024 / 1024).toFixed(2) + ' MB' : ((file.size || 0) / 1024).toFixed(2) + ' KB'}`
                        : undefined
                    }
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '12px',
                        color: glassTokens.colors.text,
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: '10px',
                        color: glassTokens.colors.textSecondary,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ p: 2, color: glassTokens.colors.textSecondary, textAlign: 'center' }}>
            Nenhum arquivo encontrado
          </Typography>
        )}
      </Box>
    </Box>
  );
};
