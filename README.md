# 🏙️ Cidade Dorme

Jogo de dedução social multiplayer online baseado no clássico jogo Mafia/Werewolf.

## 📁 Estrutura do Projeto

```
cidade-dorme-app/
├── front/           # Frontend Next.js
├── backend/         # Backend Node.js/Express
├── docker-compose.yml
└── regras.md        # Regras do jogo
```

## 🚀 Começando

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)
- Conta no [Ably](https://ably.com) para realtime communication

### Configuração

1. Clone o repositório
2. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
3. Configure sua chave do Ably no arquivo `.env`

### Rodar com Docker

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Rodar em background
docker-compose up -d

# Parar os serviços
docker-compose down
```

Acesse:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Desenvolvimento Local

#### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend
```bash
cd front
npm install
npm run dev
```

## 🎮 Sobre o Jogo

Cidade Dorme é um jogo de dedução social onde os jogadores são divididos em dois times:
- **Vilões**: Assassinos e Suicida
- **Cidadãos**: Detetive, Médico, Vidente, Bruxa, Juiz e outros

O jogo alterna entre fases de noite e dia até que uma condição de vitória seja atingida.

Veja as [regras completas](regras.md) para mais detalhes.

## 🔧 Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Realtime**: Ably
- **Container**: Docker, Docker Compose

## 📝 Licença

Este projeto é de código aberto.
