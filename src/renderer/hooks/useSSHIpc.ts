import { useCallback, useState } from 'react';
import '@shared/types/electron.d';
import type { SSHConfig } from '../../shared/types/ssh';

interface IpcResponse<T> {
  success: boolean;
  data?: T;
  id?: string;
  error?: string;
}

/**
 * Hook para gerenciar operações SSH/SFTP via IPC
 */
export function useSSHIpc() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSSHConfig = useCallback(async (config: SSHConfig) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error(
          'API do Electron não carregou. Verifique se o preload foi carregado corretamente.'
        );
      }
      const result = (await window.api.invoke('ssh:create-config', config)) as IpcResponse<string>;
      if (!result || !result.success) {
        throw new Error(result?.error || 'Erro ao criar configuração');
      }
      return result.id;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllSSHConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error(
          'API do Electron não carregou. Verifique se o preload foi carregado corretamente.'
        );
      }
      const result = (await window.api.invoke('ssh:get-all-configs')) as IpcResponse<SSHConfig[]>;
      if (!result.success) {
        throw new Error(result.error);
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

  const getSSHConfig = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error(
          'API do Electron não carregou. Verifique se o preload foi carregado corretamente.'
        );
      }
      const result = (await window.api.invoke('ssh:get-config', id)) as IpcResponse<SSHConfig>;
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSSHConfig = useCallback(async (id: string, config: Partial<SSHConfig>) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error(
          'API do Electron não carregou. Verifique se o preload foi carregado corretamente.'
        );
      }
      const result = (await window.api.invoke(
        'ssh:update-config',
        id,
        config
      )) as IpcResponse<void>;
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSSHConfig = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!window.api) {
        throw new Error(
          'API do Electron não carregou. Verifique se o preload foi carregado corretamente.'
        );
      }
      const result = (await window.api.invoke('ssh:delete-config', id)) as IpcResponse<void>;
      if (!result.success) {
        throw new Error(result.error);
      }
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
    createSSHConfig,
    getAllSSHConfigs,
    getSSHConfig,
    updateSSHConfig,
    deleteSSHConfig,
  };
}
