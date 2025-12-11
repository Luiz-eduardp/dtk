const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script: expõe uma API segura para o renderer
 * Usa contextBridge para manter segurança (sem nodeIntegration)
 */
const api = {
  /**
   * Invoca um handler IPC definido no main process
   */
  invoke: (channel, ...args) => {
    const allowedChannels = [
      'get-app-info',
      'open-file-dialog',
      'save-file-dialog',
      // SSH/SFTP channels - Config
      'ssh:create-config',
      'ssh:get-all-configs',
      'ssh:get-config',
      'ssh:update-config',
      'ssh:delete-config',
      // SSH/SFTP channels - Connection
      'ssh:connect',
      'ssh:disconnect',
      'ssh:execute-command',
      'ssh:list-files',
      'ssh:read-file',
    ];

    if (allowedChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }

    throw new Error(`Channel "${channel}" not allowed`);
  },

  /**
   * Envia uma mensagem um-para-um para o main
   */
  send: (channel, data) => {
    const allowedChannels = ['message-to-main'];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },

  /**
   * Registra listener para eventos do main
   */
  on: (channel, callback) => {
    const allowedChannels = ['event-from-main'];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },

  /**
   * Remove listener de evento
   */
  off: (channel, callback) => {
    const allowedChannels = ['event-from-main'];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.off(channel, callback);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },
};

try {
  contextBridge.exposeInMainWorld('api', api);
} catch (error) {
  console.error('Error exposing API:', error);
}
