import { useCallback, useState } from 'react';

interface IpcResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
  id?: string;
  message?: string;
}

interface FileInfo {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size: number;
}

/**
 * Hook para gerenciar conexão SSH/SFTP
 */
export const useSSHConnection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async (configId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error(
          'API do Electron não carregou. Verifique se o preload foi carregado corretamente.'
        );
      }
      const result = (await window.api.invoke('ssh:connect', configId)) as IpcResponse<void>;
      if (!result.success) {
        throw new Error(result.error || 'Erro ao conectar');
      }
      setConnected(true);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      setConnected(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async (configId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error('API do Electron não carregou.');
      }
      const result = (await window.api.invoke('ssh:disconnect', configId)) as IpcResponse<void>;
      if (!result.success) {
        throw new Error(result.error || 'Erro ao desconectar');
      }
      setConnected(false);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeCommand = useCallback(async (configId: string, command: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error('API do Electron não carregou.');
      }
      const result = (await window.api.invoke(
        'ssh:execute-command',
        configId,
        command
      )) as IpcResponse<string>;
      if (!result.success) {
        throw new Error(result.error || 'Erro ao executar comando');
      }
      return result.data || '';
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (configId: string, remotePath: string = '/') => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error('API do Electron não carregou.');
      }
      const result = (await window.api.invoke(
        'ssh:list-files',
        configId,
        remotePath
      )) as IpcResponse<FileInfo[]>;
      if (!result.success) {
        throw new Error(result.error || 'Erro ao listar arquivos');
      }
      return result.data || [];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const readFile = useCallback(async (configId: string, remotePath: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error('API do Electron não carregou.');
      }
      const result = (await window.api.invoke(
        'ssh:read-file',
        configId,
        remotePath
      )) as IpcResponse<string>;
      if (!result.success) {
        throw new Error(result.error || 'Erro ao ler arquivo');
      }
      return result.data || '';
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    connected,
    connect,
    disconnect,
    executeCommand,
    listFiles,
    readFile,
  };
};
