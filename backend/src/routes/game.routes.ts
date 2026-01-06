import { Router } from 'express';
import { GameController } from '../controllers/game.controller';

const router = Router();
const gameController = new GameController();

// Rotas do jogo
router.post('/create', gameController.createGame);
router.post('/join', gameController.joinGame);
router.get('/:gameId', gameController.getGame);
router.post('/:gameId/start', gameController.startGame);
router.post('/:gameId/action', gameController.performAction);

export default router;
