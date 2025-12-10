# 📋 DTK - Plano de Implementação

## ✅ Fase 1 - Concluída: Setup e Estrutura Base

### 1. Configuração Electron + React + TypeScript

- ✅ Electron 27 com processo principal em TypeScript
- ✅ React 18 com Vite para hot reload
- ✅ TypeScript strict mode em ambos os processos
- ✅ Preload script com contextBridge para segurança
- ✅ ts-node para desenvolvimento sem compilação

### 2. Arquitetura Atomic Design

- ✅ **Atoms:** Button, Text, GlassCard (primitivos)
- ✅ **Molecules:** Header, InfoCard (composições simples)
- ✅ **Organisms:** DashboardPanel, Sidebar (complexos)
- ✅ **Templates:** DefaultTemplate (layouts)
- ⏳ **Pages:** (serão implementadas conforme funcionalidades)

### 3. Tema Glassmorphism

- ✅ Material-UI customizado
- ✅ Efeitos de blur backdrop
- ✅ Gradientes lineares
- ✅ Cores primária (azul), secundária (roxo), terciária (ciano)
- ✅ Tokens de design centralizados

### 4. Navegação e Layout

- ✅ **Sidebar Responsivo:**
  - Desktop: sempre visível (280px)
  - Mobile: hamburger menu
  - 7 seções de navegação
  - Glass theme com backdrop blur

- ✅ **Header:**
  - Logo DTK
  - Info da aplicação
  - Estilo glassmorphism

- ✅ **DashboardPanel:**
  - Layout limpo
  - Pronto para conteúdo dinâmico
  - Bem-vindo simplificado

---

## 🚀 Fase 2 - Em Progresso: Funcionalidades Principais

### 1. Workspaces Manager

```typescript
// Interface planejada
interface Workspace {
  id: string;
  name: string;
  path: string;
  lastOpened: Date;
  config: WorkspaceConfig;
}
```

**Componentes necessários:**

- Page: WorkspacesPage
- Organism: WorkspacesGrid
- Molecules: WorkspaceCard, CreateWorkspaceDialog
- Actions: IPC handlers para file system

**Bibliotecas:**

- `fs` (Node.js)
- `path` (Node.js)

---

### 2. Editor de Código

**Recomendação:** Monaco Editor (VS Code engine)

```bash
npm install @monaco-editor/react
```

**Componentes necessários:**

- Page: EditorPage
- Organism: CodeEditor
- Molecules: FileTree, EditorTabs
- Services: FileService

**Features Fase 1:**

- [ ] Abrir/criar arquivos
- [ ] Syntax highlighting para principais linguagens
- [ ] Tabs para múltiplos arquivos
- [ ] Quick save (Ctrl+S)

---

### 3. Todo List

**Simples e local first**

```typescript
interface TodoItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  dueDate?: Date;
}
```

**Componentes necessários:**

- Page: TodoPage
- Organism: TodoList
- Molecules: TodoItem, AddTodoForm
- Services: TodoService (localStorage ou SQLite)

**Features Fase 1:**

- [ ] Criar tarefas
- [ ] Marcar como concluído
- [ ] Editar tarefas
- [ ] Filtrar por status
- [ ] Persistência localStorage

---

### 4. Terminal SSH

**Recomendação:** `ssh2` library + `xterm.js`

```bash
npm install ssh2 xterm @xterm/addon-fit
```

**Componentes necessários:**

- Page: TerminalPage
- Organism: SSHTerminal
- Molecules: ConnectionForm, SessionList
- Services: SSHService

**Features Fase 1:**

- [ ] Conectar via SSH (password)
- [ ] Renderizar terminal
- [ ] Input/output
- [ ] Conexão básica

---

### 5. SFTP - Gerenciador de Arquivos

**Usa mesma library:** `ssh2` (tem suporte SFTP)

**Componentes necessários:**

- Page: SFTPPage
- Organism: DualPaneFileManager (local vs remoto)
- Molecules: FilePane, FileActions
- Services: SFTPService

**Features Fase 1:**

- [ ] Listar arquivos locais
- [ ] Listar arquivos remotos
- [ ] Upload/download simples
- [ ] Criar/deletar arquivos

---

### 6. Git Manager

**Recomendação:** `simple-git`

```bash
npm install simple-git
```

**Componentes necessários:**

- Page: GitPage
- Organism: GitDashboard
- Molecules: CommitHistory, BranchSelector
- Services: GitService

**Features Fase 1:**

- [ ] Status repositório
- [ ] Commit simples
- [ ] View histórico
- [ ] Mudar branch

---

### 7. CI/CD Pipelines

**Integração com APIs públicas** (GitHub, GitLab)

**Componentes necessários:**

- Page: PipelinesPage
- Organism: PipelineDashboard
- Molecules: PipelineCard, LogViewer
- Services: PipelineService

**Features Fase 1:**

- [ ] GitHub Actions integration
- [ ] Listar pipelines
- [ ] Ver status
- [ ] View logs

---

## 📦 Stack Tecnológico por Feature

### Desktop

- `electron` 27+
- `electron-builder` (packaging)

### Frontend

- `react` 18+
- `@mui/material` 5
- `@emotion/react` (CSS-in-JS)

### Editor

- `@monaco-editor/react` (código)
- `xterm` / `xterm.js` (terminal)

### Back-end/Integração

- `ssh2` (SSH/SFTP)
- `simple-git` (Git)
- `axios` (HTTP requests)

### Persistência

- `localStorage` (tarefas simples)
- `better-sqlite3` (mais complexo, opcional)

### Utilities

- `lodash` (helpers)
- `date-fns` (datas)
- `zustand` (state management, opcional)

---

## 🔄 Fluxo de Desenvolvimento

### Sprint 1: Workspaces + Todo

1. Criar WorkspacesPage
2. Criar TodoPage
3. Testar navegação

### Sprint 2: Editor básico

1. Integrar Monaco Editor
2. Criar EditorPage
3. File operations

### Sprint 3: SSH

1. Configurar ssh2
2. Terminal xterm
3. Basic SSH connection

### Sprint 4: SFTP

1. File manager duplo
2. Upload/download
3. File operations

### Sprint 5: Git

1. Integrar simple-git
2. Git dashboard
3. Commit workflow

### Sprint 6: CI/CD

1. GitHub/GitLab API
2. Pipeline viewer
3. Logs

---

## 📝 Checklist por Feature

### ✅ Workspaces

- [ ] Create workspace
- [ ] List workspaces
- [ ] Edit workspace
- [ ] Delete workspace
- [ ] Open workspace

### ✅ Todo List

- [ ] Add todo
- [ ] Edit todo
- [ ] Delete todo
- [ ] Mark complete
- [ ] Filter todos
- [ ] Persist todos

### ✅ Editor

- [ ] Open file
- [ ] Create file
- [ ] Edit file
- [ ] Syntax highlighting
- [ ] Multiple tabs
- [ ] Save file

### ✅ SSH

- [ ] Connect SSH
- [ ] SSH terminal
- [ ] Command execution
- [ ] Disconnect

### ✅ SFTP

- [ ] List local files
- [ ] List remote files
- [ ] Upload file
- [ ] Download file
- [ ] Delete file
- [ ] Create folder

### ✅ Git

- [ ] Init repo
- [ ] Clone repo
- [ ] Commit changes
- [ ] Push/pull
- [ ] View history
- [ ] Branch management

### ✅ Pipelines

- [ ] Connect GitHub/GitLab
- [ ] List pipelines
- [ ] View pipeline status
- [ ] View logs
- [ ] Trigger pipeline

---

## 🎯 Próximos Passos Imediatos

1. **Criar WorkspacesPage** - começar com funcionalidade local
2. **Implementar TodoPage** - mais simples, testa arquitetura
3. **Integrar Monaco Editor** - foca em editor code
4. **Adicionar testes** - pytest ou vitest para coverage

---

**Status:** ✅ Pronto para Sprint 1
**Data:** 9 de dezembro de 2025
