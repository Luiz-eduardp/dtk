import { useCallback } from 'react';
import '@shared/types/electron.d';

/**
 * Hook: useIpc
 * Facilita a comunicação IPC entre renderer e main
 */
export function useIpc() {
  const invoke = useCallback(async (channel: string, ...args: unknown[]) => {
    try {
      const result = await window.api?.invoke(channel, ...args);
      return result;
    } catch (error) {
      console.error(`IPC invoke error on channel "${channel}":`, error);
      throw error;
    }
  }, []);

  const send = useCallback((channel: string, data?: unknown) => {
    try {
      window.api?.send(channel, data);
    } catch (error) {
      console.error(`IPC send error on channel "${channel}":`, error);
    }
  }, []);

  const on = useCallback(
    (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => {
      try {
        window.api?.on(channel, callback);
      } catch (error) {
        console.error(`IPC on error for channel "${channel}":`, error);
      }
    },
    []
  );

  const off = useCallback(
    (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => {
      try {
        window.api?.off(channel, callback);
      } catch (error) {
        console.error(`IPC off error for channel "${channel}":`, error);
      }
    },
    []
  );

  return { invoke, send, on, off };
}

export default useIpc;
