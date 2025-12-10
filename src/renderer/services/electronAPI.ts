import '@shared/types/electron.d';

/**
 * Serviço de API Electron
 * Centraliza chamadas IPC para a aplicação
 */

interface AppInfo {
  version: string;
  name: string;
  isDev: boolean;
}

export const electronAPI = {
  /**
   * Obtém informações da aplicação
   */
  getAppInfo: async (): Promise<AppInfo> => {
    return (
      (window.api?.invoke('get-app-info') as Promise<AppInfo>) ||
      Promise.reject('API not available')
    );
  },

  /**
   * Abre um diálogo para selecionar arquivo
   */
  openFile: async (): Promise<string | null> => {
    return (
      (window.api?.invoke('open-file-dialog') as Promise<string | null>) || Promise.resolve(null)
    );
  },

  /**
   * Abre um diálogo para salvar arquivo
   */
  saveFile: async (content: string): Promise<string | null> => {
    return (
      (window.api?.invoke('save-file-dialog', content) as Promise<string | null>) ||
      Promise.resolve(null)
    );
  },
};

export default electronAPI;
