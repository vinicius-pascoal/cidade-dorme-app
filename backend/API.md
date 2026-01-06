# 🏙️ Cidade Dorme - Backend API

Backend completo do jogo Cidade Dorme com toda a lógica de jogo implementada.

## � Documentação Swagger

A documentação interativa da API está disponível via Swagger UI:

```
http://localhost:3001/api-docs
```

Acesse a URL acima após iniciar o servidor para testar todos os endpoints interativamente.

## �🚀 Começando

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Conta no [Ably](https://ably.com) para comunicação real-time

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis em `.env`:
```env
PORT=3001
ABLY_API_KEY=your-ably-key-here
NODE_ENV=development
```

### Desenvolvimento

```bash
npm run dev
```

Servidor disponível em [http://localhost:3001](http://localhost:3001)

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/           # Controladores HTTP
│   │   └── game.controller.ts
│   ├── services/              # Lógica de negócio
│   │   ├── game.service.ts
│   │   ├── role-assignment.service.ts
│   │   ├── phase-manager.service.ts
│   │   ├── night-action.service.ts
│   │   ├── voting.service.ts
│   │   ├── victory-condition.service.ts
│   │   └── ably.service.ts
│   ├── routes/
│   │   └── game.routes.ts
│   ├── types/
│   │   └── game.types.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── index.ts
└── ...
```

## 🎮 API Endpoints

### Gerenciamento do Jogo

#### Criar Jogo
```http
POST /games/create
Content-Type: application/json

{
  "hostName": "João"
}
```

#### Entrar no Jogo
```http
POST /games/join
Content-Type: application/json

{
  "code": "XYZ789",
  "playerName": "Maria"
}
```

#### Obter Jogo
```http
GET /games/:gameId
```

#### Obter Jogo para Jogador
```http
GET /games/:gameId/player/:playerId
```

#### Iniciar Jogo
```http
POST /games/:gameId/start
Content-Type: application/json

{
  "hostId": "player123"
}
```

### Ações Noturnas

#### Realizar Ação Noturna
```http
POST /games/:gameId/night-action
Content-Type: application/json

{
  "playerId": "player123",
  "actionType": "ASSASSIN_KILL",
  "targetId": "player456"
}
```

**Tipos de Ação:**
- `ASSASSIN_KILL` - Assassinos matam
- `DOCTOR_SAVE` - Médico salva
- `DETECTIVE_INVESTIGATE` - Detetive investiga
- `SEER_REVEAL` - Vidente revela papel
- `WITCH_HEAL` - Bruxa cura
- `WITCH_KILL` - Bruxa mata

#### Finalizar Noite
```http
POST /games/:gameId/end-night
```

### Votação

#### Registrar Voto
```http
POST /games/:gameId/vote
Content-Type: application/json

{
  "voterId": "player123",
  "targetId": "player456"
}
```

#### Finalizar Votação
```http
POST /games/:gameId/end-voting
```

### Controle de Fase

#### Avançar Fase
```http
POST /games/:gameId/advance-phase
Content-Type: application/json

{
  "hostId": "player123"
}
```

## 🎭 Papéis do Jogo

### Vilões
- **ASSASSINO** - Mata durante a noite
- **LIDER_ASSASSINOS** - Assassino com voto de desempate
- **SUICIDA** - Vence se eliminado por votação

### Cidadãos
- **DETETIVE** - Investiga se jogador é vilão
- **VIDENTE** - Descobre papel exato
- **MEDICO** - Salva um jogador
- **BRUXA** - 1 poção de cura + 1 de morte
- **JUIZ** - Desempata votações
- **DELEGADO** - Voto duplo
- **FANTASMA** - Após morrer, pode ajudar
- **CIDADAO** - Sem habilidades especiais

## 🔄 Fases do Jogo

1. **LOBBY** - Aguardando jogadores (10-12)
2. **NIGHT** - Fase noturna com ações especiais
3. **DAY_DISCUSSION** - Discussão livre
4. **DAY_VOTING** - Votação para eliminação
5. **ENDED** - Jogo finalizado

## 🏆 Condições de Vitória

**Cidadãos:** Eliminar todos os assassinos

**Assassinos:** Igualar ou superar número de cidadãos

**Suicida:** Ser eliminado por votação (vitória solo)

## 🔔 Eventos Real-time (Ably)

- `game:created`
- `player:joined`
- `game:started`
- `player:{id}:role` (privado)
- `night:action_registered`
- `night:ended`
- `player:{id}:investigation` (privado)
- `vote:cast`
- `voting:ended`
- `phase:changed`

## 🛠️ Tecnologias

- Node.js + Express
- TypeScript
- Ably (Real-time)
- ts-node-dev

## 📝 Arquitetura

Arquitetura em camadas com serviços especializados:

- **GameService** - Orquestração principal
- **RoleAssignmentService** - Distribuição de papéis
- **PhaseManagerService** - Gerenciamento de fases
- **NightActionService** - Ações noturnas
- **VotingService** - Sistema de votação
- **VictoryConditionService** - Verificação de vitórias
- **AblyService** - Comunicação real-time

## 📄 Licença

Open source
