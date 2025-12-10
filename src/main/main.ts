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

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

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
app.whenReady().then(() => {
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
