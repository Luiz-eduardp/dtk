/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * main.ts - Processo Principal do Electron
 *
 * NOTA: Para desenvolvimento, este arquivo precisa ser compilado ou
 * executado com ts-node. Para produção, use o arquivo compilado em dist/main/main.js
 *
 * Arquitetura:
 * - BrowserWindow: janela principal (renderer process)
 * - ipcMain: handlers para comunicação IPC
 * - Preload: arquivo de bridge seguro (contextBridge)
 *
 * Segurança:
 * - nodeIntegration: false (não expõe require/process ao renderer)
 * - contextIsolation: true (isolamento entre contextos)
 * - preload: valida e expõe apenas APIs necessárias
 */

import { app, BrowserWindow, ipcMain, Menu, dialog, MenuItemConstructorOptions } from 'electron';
import path from 'path';
import * as fs from 'fs';
import { Client } from 'ssh2';
import { getDatabaseManager } from './database';
import { SSHConfig } from '../shared/types/ssh';

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

const sshConnections = new Map<string, Client>();

/**
 * Cria a janela principal da aplicação
 */
function createWindow(): BrowserWindow {
  const preloadPath = path.join(__dirname, 'preload.js');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: path.join(__dirname, '../../public/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../dist/renderer/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

/**
 * Cria o menu da aplicação
 */
function createMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Recortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'Visualização',
      submenu: [
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Força recarregar', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Alternar DevTools', accelerator: 'CmdOrCtrl+Shift+I', role: 'toggleDevTools' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Configura os handlers IPC para comunicação com o renderer
 * Importante: todos os canais devem estar na whitelist do preload
 */
function setupIpcHandlers(): void {
  const db = getDatabaseManager();

  ipcMain.handle('get-app-info', () => {
    return {
      version: app.getVersion(),
      name: app.getName(),
      isDev,
    };
  });

  ipcMain.handle('open-file-dialog', async () => {
    if (!mainWindow) return null;

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Todos os arquivos', extensions: ['*'] },
        { name: 'Imagens', extensions: ['jpg', 'png', 'gif'] },
      ],
    });

    return result.filePaths[0] ?? null;
  });

  ipcMain.handle(
    'save-file-dialog',
    async (_event: Electron.IpcMainInvokeEvent, content: string) => {
      if (!mainWindow) return null;

      const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: 'documento.txt',
        filters: [{ name: 'Arquivo de texto', extensions: ['txt'] }],
      });

      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, content);
        return result.filePath;
      }

      return null;
    }
  );

  ipcMain.handle('ssh:create-config', async (_event, config: SSHConfig) => {
    try {
      const id = await db.createSSHConfig(config);
      return { success: true, id };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:get-all-configs', async () => {
    try {
      const configs = await db.getAllSSHConfigs();
      return { success: true, data: configs };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:get-config', async (_event, id: string) => {
    try {
      const config = await db.getSSHConfigById(id);
      return { success: true, data: config };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:update-config', async (_event, id: string, config: Partial<SSHConfig>) => {
    try {
      await db.updateSSHConfig(id, config);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:delete-config', async (_event, id: string) => {
    try {
      await db.deleteSSHConfig(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:connect', async (_event, configId: string) => {
    try {
      const config = await db.getSSHConfigById(configId);
      if (!config) {
        return { success: false, error: 'Configuração não encontrada' };
      }

      const client = new Client();

      return new Promise((resolve) => {
        client.on('ready', () => {
          sshConnections.set(configId, client);
          resolve({ success: true, message: 'Conectado ao SSH' });
        });

        client.on('error', (err: Error) => {
          resolve({ success: false, error: err.message });
        });

        client.on('close', () => {
          sshConnections.delete(configId);
        });

        const connectConfig: Record<string, unknown> = {
          host: config.host,
          port: config.port || 22,
          username: config.username,
        };

        if (config.password) {
          connectConfig.password = config.password;
        }

        if (config.privateKey) {
          connectConfig.privateKey = config.privateKey;
          if (config.passphrase) {
            connectConfig.passphrase = config.passphrase;
          }
        } else if (config.privateKeyPath) {
          try {
            connectConfig.privateKey = fs.readFileSync(config.privateKeyPath);
            if (config.passphrase) {
              connectConfig.passphrase = config.passphrase;
            }
          } catch (err) {
            resolve({
              success: false,
              error: `Erro ao ler chave privada: ${(err as Error).message}`,
            });
            return;
          }
        }

        client.connect(connectConfig);
      });
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:execute-command', async (_event, configId: string, command: string) => {
    try {
      const client = sshConnections.get(configId);
      if (!client) {
        return { success: false, error: 'Não conectado ao SSH' };
      }

      return new Promise((resolve) => {
        client.exec(command, (err: Error | undefined, stream: any) => {
          if (err) {
            resolve({ success: false, error: err.message });
            return;
          }

          let stdout = '';
          let stderr = '';

          stream.on('close', () => {
            resolve({
              success: true,
              data: stdout || stderr || 'Comando executado',
            });
          });

          stream.on('data', (data: Buffer) => {
            stdout += data.toString();
          });

          if (stream.stderr) {
            stream.stderr.on('data', (data: Buffer) => {
              stderr += data.toString();
            });
          }
        });
      });
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:list-files', async (_event, configId: string, remotePath: string = '/') => {
    try {
      const client = sshConnections.get(configId);
      if (!client) {
        return { success: false, error: 'Não conectado ao SSH' };
      }

      return new Promise((resolve) => {
        (client as any).sftp((err: Error | undefined, sftpClient: any) => {
          if (err) {
            resolve({ success: false, error: err.message });
            return;
          }

          sftpClient.readdir(remotePath, (err: Error | undefined, list: any[]) => {
            if (err) {
              resolve({ success: false, error: err.message });
              return;
            }

            const files = (list || []).map((file: any) => ({
              name: file.filename || '',
              path: remotePath,
              type: (file.longname || '').startsWith('d') ? 'directory' : 'file',
              size: file.attrs?.size || 0,
            }));

            resolve({ success: true, data: files });
          });
        });
      });
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:read-file', async (_event, configId: string, remotePath: string) => {
    try {
      const client = sshConnections.get(configId);
      if (!client) {
        return { success: false, error: 'Não conectado ao SSH' };
      }

      return new Promise((resolve) => {
        (client as any).sftp((err: Error | undefined, sftpClient: any) => {
          if (err) {
            resolve({ success: false, error: err.message });
            return;
          }

          const stream = sftpClient.createReadStream(remotePath);
          let content = '';

          stream.on('data', (chunk: Buffer) => {
            content += chunk.toString();
          });

          stream.on('end', () => {
            resolve({ success: true, data: content });
          });

          stream.on('error', (err: Error) => {
            resolve({ success: false, error: err.message });
          });
        });
      });
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('ssh:disconnect', async (_event, configId: string) => {
    try {
      const client = sshConnections.get(configId);
      if (client) {
        client.end();
        sshConnections.delete(configId);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}

/**
 * Lidar com segundas instâncias em Windows
 * Garante que apenas uma instância da aplicação rodará
 */
if (process.type === 'browser') {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  }
}

/**
 * Handler quando o app está pronto
 */
app.whenReady().then(async () => {
  try {
    const db = getDatabaseManager();
    await db.initialize();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }

  createWindow();
  createMenu();
  setupIpcHandlers();
});

/**
 * Sair quando todas as janelas forem fechadas (exceto no macOS)
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Re-criar janela quando app é ativado (macOS)
 */
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
