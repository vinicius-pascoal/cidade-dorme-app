import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cidade Dorme API',
      version: '1.0.0',
      description: 'API completa para o jogo de dedução social Cidade Dorme',
      contact: {
        name: 'Cidade Dorme Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.cidadedorme.com',
        description: 'Servidor de Produção',
      },
    ],
    tags: [
      {
        name: 'Game Management',
        description: 'Endpoints para gerenciamento do jogo',
      },
      {
        name: 'Night Actions',
        description: 'Endpoints para ações da fase noturna',
      },
      {
        name: 'Voting',
        description: 'Endpoints para sistema de votação',
      },
      {
        name: 'Phase Control',
        description: 'Endpoints para controle de fases do jogo',
      },
    ],
    components: {
      schemas: {
        Game: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do jogo',
            },
            code: {
              type: 'string',
              description: 'Código de 6 caracteres para entrar no jogo',
            },
            hostId: {
              type: 'string',
              description: 'ID do jogador host',
            },
            players: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Player',
              },
            },
            status: {
              type: 'string',
              enum: ['WAITING', 'PLAYING', 'FINISHED'],
              description: 'Status atual do jogo',
            },
            phase: {
              type: 'string',
              enum: ['LOBBY', 'NIGHT', 'DAY_DISCUSSION', 'DAY_VOTING', 'ENDED'],
              description: 'Fase atual do jogo',
            },
            round: {
              type: 'integer',
              description: 'Rodada atual',
            },
            winner: {
              type: 'string',
              enum: ['VILLAINS', 'CITIZENS', 'SUICIDA'],
              nullable: true,
              description: 'Time vencedor (se jogo terminou)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            endedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        Player: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do jogador',
            },
            name: {
              type: 'string',
              description: 'Nome do jogador',
            },
            isAlive: {
              type: 'boolean',
              description: 'Se o jogador está vivo',
            },
            isHost: {
              type: 'boolean',
              description: 'Se o jogador é o host',
            },
            role: {
              type: 'string',
              enum: [
                'ASSASSINO',
                'LIDER_ASSASSINOS',
                'SUICIDA',
                'DETETIVE',
                'VIDENTE',
                'MEDICO',
                'BRUXA',
                'JUIZ',
                'DELEGADO',
                'FANTASMA',
                'CIDADAO',
              ],
              description: 'Papel do jogador (apenas visível para o próprio jogador)',
            },
            team: {
              type: 'string',
              enum: ['VILLAINS', 'CITIZENS'],
              description: 'Time do jogador',
            },
          },
        },
        NightAction: {
          type: 'object',
          properties: {
            playerId: {
              type: 'string',
              description: 'ID do jogador executando a ação',
            },
            actionType: {
              type: 'string',
              enum: [
                'ASSASSIN_KILL',
                'DOCTOR_SAVE',
                'DETECTIVE_INVESTIGATE',
                'SEER_REVEAL',
                'WITCH_HEAL',
                'WITCH_KILL',
              ],
              description: 'Tipo de ação noturna',
            },
            targetId: {
              type: 'string',
              description: 'ID do jogador alvo',
            },
          },
          required: ['playerId', 'actionType'],
        },
        NightResult: {
          type: 'object',
          properties: {
            finalDeaths: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'IDs dos jogadores que morreram',
            },
          },
        },
        VotingResult: {
          type: 'object',
          properties: {
            eliminated: {
              type: 'string',
              nullable: true,
              description: 'ID do jogador eliminado',
            },
            isTie: {
              type: 'boolean',
              description: 'Se houve empate',
            },
            judgeDecision: {
              type: 'string',
              nullable: true,
              description: 'Decisão do juiz em caso de empate',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
