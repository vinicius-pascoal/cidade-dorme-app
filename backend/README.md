# 🏙️ Cidade Dorme - Backend

Backend do jogo Cidade Dorme, construído com Node.js, Express e TypeScript.

## 🚀 Tecnologias

- Node.js
- Express
- TypeScript
- Ably (Realtime Communication)

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

Copie o arquivo `.env.example` para `.env` e configure suas variáveis:

```bash
cp .env.example .env
```

Variáveis necessárias:
- `PORT`: Porta do servidor (padrão: 3001)
- `ABLY_API_KEY`: Chave da API do Ably

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🐳 Docker

```bash
docker build -t cidade-dorme-backend .
docker run -p 3001:3001 --env-file .env cidade-dorme-backend
```

## 📁 Estrutura

```
src/
├── controllers/     # Controladores das rotas
├── services/        # Lógica de negócio
├── routes/          # Definição de rotas
├── middleware/      # Middlewares
└── index.ts         # Entry point
```

## 🔌 API Endpoints

- `GET /health` - Health check
- `POST /api/game/create` - Criar novo jogo
- `POST /api/game/join` - Entrar em um jogo
- `GET /api/game/:gameId` - Buscar informações do jogo
- `POST /api/game/:gameId/start` - Iniciar jogo
- `POST /api/game/:gameId/action` - Executar ação no jogo
