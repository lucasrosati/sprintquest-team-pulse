# 🧩 SprintQuest - Frontend

Este é o repositório da interface web do **SprintQuest**, uma plataforma gamificada para times de desenvolvimento ágil com foco em produtividade, motivação e engajamento.

---

## 🚀 Tecnologias Utilizadas

- **React** com **TypeScript**
- **Tailwind CSS** para estilos
- **ShadCN UI** e **Lucide Icons**
- Integração com backend em **Spring Boot**
- Comunicação via **REST API**
- **Vite** para build e desenvolvimento

---

## 🛠️ Pré-requisitos

- Node.js v18+ instalado
- Gerenciador de pacotes: `npm` ou `yarn`
- Backend rodando localmente em `http://localhost:8080`

---

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/lucasrosati/sprintquest-team-pulse.git
cd sprintquest-team-pulse
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn
```

3. **Crie um arquivo `.env` com as variáveis necessárias:**

```env
VITE_API_URL=http://localhost:8080/api
```

---

## ▶️ Executando o projeto

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em:  
📍 `http://localhost:5173`

---

## 🧪 Funcionalidades disponíveis

- Criação de projetos com nome, descrição e equipe
- Criação de tarefas em colunas do Kanban
- Atribuição de membros reais a tarefas
- Visualização responsiva e interativa do progresso do time
- Diálogo para criação de tarefas integrado com API REST

---

## 📁 Estrutura de Pastas

```bash
src/
├── components/
│   ├── KanbanBoard.tsx
│   ├── projects/
│   │   └── CreateTaskDialog.tsx
├── lib/
│   └── api.ts
├── hooks/
│   └── use-toast.ts
```

---

## 👥 Contribuidores

Projeto desenvolvido em equipe no contexto acadêmico. Para conhecer o time completo, acesse o [repositório principal](https://github.com/seu-usuario/sprintquest).

---

## 📜 Licença

Este projeto é apenas para fins educacionais e não possui licença de uso comercial neste momento.
