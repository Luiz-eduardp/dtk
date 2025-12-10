/**
 * Tipagens para o Electron e IPC
 * Define a API segura exposta via contextBridge
 */

declare global {
  interface Window {
    api: {
      /**
       * Invoca um comando no processo main
       * @param channel - nome do canal IPC
       * @param ...args - argumentos adicionais
       * @returns Promise com a resposta do main
       */
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;

      /**
       * Envia uma mensagem para o processo main
       * @param channel - nome do canal IPC
       * @param data - dados a enviar
       */
      send: (channel: string, data?: unknown) => void;

      /**
       * Registra listener para eventos do main
       * @param channel - nome do canal IPC
       * @param callback - função a executar quando evento é recebido
       */
      on: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;

      /**
       * Remove listener de eventos do main
       * @param channel - nome do canal IPC
       * @param callback - função previamente registrada
       */
      off: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;
    };
  }
}

export {};
