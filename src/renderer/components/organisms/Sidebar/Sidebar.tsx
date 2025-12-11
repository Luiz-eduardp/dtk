import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  FolderOpen as FolderOpenIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  Source as GitIcon,
  Bolt as PipelineIcon,
  Settings as SettingsIcon,
  TaskAlt as TodoIcon,
} from '@mui/icons-material';
import { glassTokens } from '@theme/theme';

interface SidebarProps {
  onNavigate?: (section: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FolderOpenIcon,
      section: 'dashboard',
    },
    {
      id: 'ssh-sftp',
      label: 'SSH / SFTP',
      icon: TerminalIcon,
      section: 'ssh-sftp',
    },
    {
      id: 'editor',
      label: 'Editor de Código',
      icon: CodeIcon,
      section: 'editor',
    },
    {
      id: 'todolist',
      label: 'Todo List',
      icon: TodoIcon,
      section: 'todolist',
    },
    {
      id: 'git',
      label: 'Git Manager',
      icon: GitIcon,
      section: 'git',
    },
    {
      id: 'pipelines',
      label: 'CI/CD Pipelines',
      icon: PipelineIcon,
      section: 'pipelines',
    },
  ];

  const handleNavigate = (section: string) => {
    onNavigate?.(section);
    setOpen(false);
  };

  const drawerContent = (
    <Box sx={{ width: 280 }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundImage: `linear-gradient(135deg, ${glassTokens.colors.primary} 0%, ${glassTokens.colors.secondary} 100%)`,
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Menu
        </Typography>
        <IconButton
          size="small"
          onClick={() => setOpen(false)}
          sx={{ color: '#fff', display: { xs: 'block', md: 'none' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.section)}
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: `${glassTokens.colors.glass}`,
                  color: glassTokens.colors.primary,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Settings */}
      <List sx={{ py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: `${glassTokens.colors.glass}`,
                color: glassTokens.colors.primary,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Hamburger Menu Button (Mobile) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            color: glassTokens.colors.primary,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Drawer - Mobile */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer - Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundImage: `linear-gradient(180deg, ${glassTokens.colors.glass} 0%, rgba(30, 41, 59, 0.05) 100%)`,
            backdropFilter: glassTokens.backdrop.blur,
            WebkitBackdropFilter: glassTokens.backdrop.blur,
            borderRight: `1px solid ${glassTokens.colors.glassLight}`,
            boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar;
