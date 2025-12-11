import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script: expõe uma API segura para o renderer
 * Usa contextBridge para manter segurança (sem nodeIntegration)
 *
 * SEGURANÇA: Este arquivo roda em contexto com acesso ao Electron
 * Apenas métodos explicitamente expostos aqui podem ser acessados do renderer
 */

const api = {
  /**
   * Invoca um handler IPC definido no main process
   * @param channel - nome do handler
   * @param args - argumentos a passar
   */
  invoke: (channel: string, ...args: unknown[]) => {
    const allowedChannels = [
      'get-app-info',
      'open-file-dialog',
      'save-file-dialog',
      'ssh:create-config',
      'ssh:get-all-configs',
      'ssh:get-config',
      'ssh:update-config',
      'ssh:delete-config',
    ];

    if (allowedChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }

    throw new Error(`Channel "${channel}" not allowed`);
  },

  /**
   * Envia uma mensagem um-para-um para o main
   * @param channel - nome do canal
   * @param data - dados a enviar
   */
  send: (channel: string, data?: unknown) => {
    const allowedChannels = ['message-to-main'];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },

  /**
   * Registra listener para eventos do main
   * @param channel - nome do canal
   * @param callback - função a executar
   */
  on: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => {
    const allowedChannels = ['event-from-main'];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    } else {
      throw new Error(`Channel "${channel}" not allowed`);
    }
  },

  /**
   * Remove listener de evento
   * @param channel - nome do canal
   * @param callback - função previamente registrada
   */
  off: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => {
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
