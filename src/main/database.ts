import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';
import { SSHConfig } from '../shared/types/ssh';

/**
 * Gerenciador de banco de dados SQLite para configs SSH/SFTP
 */
export class DatabaseManager {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'ssh-sftp-configs.db');
    this.db = new sqlite3.Database(this.dbPath);
  }

  /**
   * Inicializa o banco de dados e cria as tabelas necessárias
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          `
          CREATE TABLE IF NOT EXISTS ssh_configs (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            host TEXT NOT NULL,
            port INTEGER DEFAULT 22,
            username TEXT NOT NULL,
            password TEXT,
            privateKey TEXT,
            privateKeyPath TEXT,
            passphrase TEXT,
            description TEXT,
            createdAt TEXT,
            updatedAt TEXT
          )
          `,
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });
  }

  /**
   * Criar nova configuração SSH
   */
  async createSSHConfig(config: SSHConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = `ssh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const sql = `
        INSERT INTO ssh_configs 
        (id, name, host, port, username, password, privateKey, privateKeyPath, passphrase, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [
          id,
          config.name,
          config.host,
          config.port || 22,
          config.username,
          config.password || null,
          config.privateKey || null,
          config.privateKeyPath || null,
          config.passphrase || null,
          config.description || null,
          now,
          now,
        ],
        (err) => {
          if (err) reject(err);
          else resolve(id);
        }
      );
    });
  }

  /**
   * Obter todas as configurações SSH
   */
  async getAllSSHConfigs(): Promise<SSHConfig[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM ssh_configs ORDER BY createdAt DESC', (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []) as SSHConfig[]);
      });
    });
  }

  /**
   * Obter configuração SSH por ID
   */
  async getSSHConfigById(id: string): Promise<SSHConfig | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM ssh_configs WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve((row as SSHConfig) || null);
      });
    });
  }

  /**
   * Atualizar configuração SSH
   */
  async updateSSHConfig(id: string, config: Partial<SSHConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updates: string[] = [];
      const values: (string | number | null)[] = [];

      Object.entries(config).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      });

      updates.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      const sql = `UPDATE ssh_configs SET ${updates.join(', ')} WHERE id = ?`;

      this.db.run(sql, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Deletar configuração SSH
   */
  async deleteSSHConfig(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM ssh_configs WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Fechar conexão com o banco de dados
   */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

let dbManager: DatabaseManager | null = null;

export function getDatabaseManager(): DatabaseManager {
  if (!dbManager) {
    dbManager = new DatabaseManager();
  }
  return dbManager;
}
