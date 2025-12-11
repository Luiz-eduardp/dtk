/**
 * Tipos globais para window.api
 */

interface WindowApi {
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
  send: (channel: string, data?: unknown) => void;
  on: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;
  off: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    api: WindowApi;
  }
}

export {};
