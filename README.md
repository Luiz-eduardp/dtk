# DTK - Devops Toolkit

Electron + React + TypeScript com Atomic Design e Glassmorphism

Uma aplicação desktop moderna para gerenciamento de workspaces, edição de código, SSH/SFTP, Git e pipelines CI/CD.

---

## Roadmap de Funcionalidades

### 1. Workspaces Manager

- [ ] Listar workspaces locais
- [ ] Criar novo workspace
- [ ] Editar configurações
- [ ] Remover workspace
- [ ] Sincronização com cloud (opcional)

### 2. Editor de Código

- [ ] Syntax highlighting (Monaco Editor ou CodeMirror)
- [ ] Abertura de arquivos e pastas
- [ ] Múltiplas abas
- [ ] Buscar e substituir
- [ ] Suporte a temas
- [ ] Atalhos de teclado customizáveis

### 3. Terminal SSH

- [ ] Cliente SSH integrado
- [ ] Conexão com servidores remotos
- [ ] Histórico de conexões
- [ ] Autenticação por senha e chave SSH
- [ ] Abas múltiplas
- [ ] Upload de chaves
- [ ] Armazenamento criptografado de credenciais

### 4. SFTP - Gerenciador de Arquivos

- [ ] Interface local e remota
- [ ] Upload e download
- [ ] Sincronização automática
- [ ] Filtro por tipo de arquivo
- [ ] Busca
- [ ] Pré-visualização de arquivos
- [ ] Operações em lote

### 5. Git Manager

- [ ] Criar e clonar repositórios
- [ ] Visualização de histórico
- [ ] Branching e merge visual
- [ ] Status de arquivos
- [ ] Commit com mensagem
- [ ] Pull, push e fetch automático
- [ ] Resolução de conflitos
- [ ] Integração com GitHub, GitLab e Gitea

### 6. CI/CD Pipelines

- [ ] Visualização de pipelines
- [ ] Status de builds
- [ ] Logs em tempo real
- [ ] Trigger manual
- [ ] Histórico de deploys
- [ ] Notificações
- [ ] Dashboard de métricas

### 7. Todo List

- [ ] Criar, editar e remover tarefas
- [ ] Marcar como concluído
- [ ] Categorias e tags
- [ ] Filtros por status e categoria
- [ ] Persistência local (JSON ou SQLite)
- [ ] Sincronização opcional com servidor
- [ ] Lembretes e notificações
- [ ] Exportação (CSV, PDF)

### 8. Funcionalidades Gerais

- [ ] Tema claro e escuro
- [ ] Atalhos globais
- [ ] Command palette (Ctrl+K / Cmd+K)
- [ ] Notificações do sistema
- [ ] Configurações persistentes
- [ ] Auto-update
- [ ] Logging e ferramentas de debug
- [ ] Exportação de dados

---

## Características Implementadas

- Arquitetura baseada em Atomic Design
- Tema Glassmorphism com Material UI
- IPC seguro usando contextBridge
- Build com Vite (HMR)
- TypeScript strict mode
- Layout responsivo
- Sidebar de navegação

---

## Quick Start

### Pré-requisitos

- Node.js >18
- npm ou yarn

### Instalação

```bash
npm install
