/**
 * Tipos para configurações de SSH e SFTP
 */

export interface SSHConfig {
  id?: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  privateKeyPath?: string;
  passphrase?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SFTPConfig extends SSHConfig {
  remotePath?: string;
  localPath?: string;
}

export interface ConnectionStatus {
  id: string;
  isConnected: boolean;
  lastConnected?: string;
  error?: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedTime?: string;
  permissions?: string;
}

export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  error?: string;
}

export interface CodeFile {
  id: string;
  configId: string;
  path: string;
  content: string;
  language: string;
  isModified: boolean;
  lastModified?: string;
}

export interface EditorState {
  openFiles: CodeFile[];
  activeFileId?: string;
  splitView?: boolean;
  theme: 'dark' | 'light';
}
