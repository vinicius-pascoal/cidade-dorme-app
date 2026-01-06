import { Router } from 'express';
import { GameController } from '../controllers/game.controller';

const router = Router();
const gameController = new GameController();

/**
 * @swagger
 * /api/game/create:
 *   post:
 *     tags:
 *       - Game Management
 *     summary: Cria um novo jogo
 *     description: Cria uma nova sala de jogo com o host especificado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostName
 *             properties:
 *               hostName:
 *                 type: string
 *                 example: João
 *     responses:
 *       201:
 *         description: Jogo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create', gameController.createGame);

/**
 * @swagger
 * /api/game/join:
 *   post:
 *     tags:
 *       - Game Management
 *     summary: Entra em um jogo existente
 *     description: Permite que um jogador entre em uma sala usando o código do jogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - playerName
 *             properties:
 *               code:
 *                 type: string
 *                 example: XYZ789
 *               playerName:
 *                 type: string
 *                 example: Maria
 *     responses:
 *       200:
 *         description: Jogador entrou com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 game:
 *                   $ref: '#/components/schemas/Game'
 *                 playerId:
 *                   type: string
 *       400:
 *         description: Código inválido ou jogo já iniciado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/join', gameController.joinGame);

/**
 * @swagger
 * /api/game/{gameId}:
 *   get:
 *     tags:
 *       - Game Management
 *     summary: Obtém informações do jogo
 *     description: Retorna os dados completos de um jogo específico
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do jogo
 *     responses:
 *       200:
 *         description: Informações do jogo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Jogo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:gameId', gameController.getGame);

/**
 * @swagger
 * /api/game/{gameId}/player/{playerId}:
 *   get:
 *     tags:
 *       - Game Management
 *     summary: Obtém informações do jogo para um jogador específico
 *     description: Retorna dados do jogo incluindo o papel do jogador
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações do jogo e jogador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 game:
 *                   $ref: '#/components/schemas/Game'
 *                 player:
 *                   $ref: '#/components/schemas/Player'
 *                 gameStats:
 *                   type: object
 *       404:
 *         description: Jogo ou jogador não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:gameId/player/:playerId', gameController.getGameForPlayer);

/**
 * @swagger
 * /api/game/{gameId}/start:
 *   post:
 *     tags:
 *       - Game Management
 *     summary: Inicia o jogo
 *     description: Distribui papéis e inicia a primeira noite (10-12 jogadores necessários)
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostId
 *             properties:
 *               hostId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Jogo iniciado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 game:
 *                   $ref: '#/components/schemas/Game'
 *       400:
 *         description: Número de jogadores inválido ou não é o host
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:gameId/start', gameController.startGame);

/**
 * @swagger
 * /api/game/{gameId}/night-action:
 *   post:
 *     tags:
 *       - Night Actions
 *     summary: Realiza uma ação noturna
 *     description: Registra a ação de um personagem durante a fase noturna
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NightAction'
 *           examples:
 *             assassin:
 *               summary: Assassino mata
 *               value:
 *                 playerId: player123
 *                 actionType: ASSASSIN_KILL
 *                 targetId: player456
 *             doctor:
 *               summary: Médico salva
 *               value:
 *                 playerId: player789
 *                 actionType: DOCTOR_SAVE
 *                 targetId: player456
 *             detective:
 *               summary: Detetive investiga
 *               value:
 *                 playerId: player321
 *                 actionType: DETECTIVE_INVESTIGATE
 *                 targetId: player456
 *     responses:
 *       200:
 *         description: Ação registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Ação inválida ou fase incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:gameId/night-action', gameController.performNightAction);

/**
 * @swagger
 * /api/game/{gameId}/end-night:
 *   post:
 *     tags:
 *       - Night Actions
 *     summary: Finaliza a fase noturna
 *     description: Processa todas as ações noturnas e transiciona para o dia
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Noite processada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NightResult'
 *       400:
 *         description: Não está na fase noturna
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:gameId/end-night', gameController.endNight);

/**
 * @swagger
 * /api/game/{gameId}/vote:
 *   post:
 *     tags:
 *       - Voting
 *     summary: Registra um voto
 *     description: Registra o voto de um jogador durante a fase de votação
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voterId
 *               - targetId
 *             properties:
 *               voterId:
 *                 type: string
 *               targetId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Voto registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Voto inválido ou fase incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:gameId/vote', gameController.castVote);

/**
 * @swagger
 * /api/game/{gameId}/end-voting:
 *   post:
 *     tags:
 *       - Voting
 *     summary: Finaliza a votação
 *     description: Processa todos os votos e elimina o jogador mais votado
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Votação processada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VotingResult'
 *       400:
 *         description: Não está na fase de votação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:gameId/end-voting', gameController.endVoting);

/**
 * @swagger
 * /api/game/{gameId}/advance-phase:
 *   post:
 *     tags:
 *       - Phase Control
 *     summary: Avança a fase do jogo
 *     description: Permite ao host avançar para a próxima fase do jogo
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostId
 *             properties:
 *               hostId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fase avançada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Não pode avançar fase ou não é o host
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:gameId/advance-phase', gameController.advancePhase);

export default router;
