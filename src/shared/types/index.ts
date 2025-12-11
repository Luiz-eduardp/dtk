/**
 * Tipos compartilhados entre renderer e main
 */

export interface AppConfig {
  isDev: boolean;
  isProduction: boolean;
}

export interface AppVersion {
  app: string;
  electron: string;
  chrome: string;
  node: string;
}

export * from './ssh';
