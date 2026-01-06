import { Request, Response } from 'express';
import { GameService } from '../services/game.service';

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  createGame = async (req: Request, res: Response) => {
    try {
      const { hostName } = req.body;
      const game = await this.gameService.createGame(hostName);
      res.status(201).json(game);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar jogo' });
    }
  };

  joinGame = async (req: Request, res: Response) => {
    try {
      const { gameId, playerName } = req.body;
      const result = await this.gameService.joinGame(gameId, playerName);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao entrar no jogo' });
    }
  };

  getGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const game = await this.gameService.getGame(gameId);
      res.status(200).json(game);
    } catch (error) {
      res.status(404).json({ error: 'Jogo não encontrado' });
    }
  };

  startGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const result = await this.gameService.startGame(gameId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao iniciar jogo' });
    }
  };

  performAction = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const action = req.body;
      const result = await this.gameService.performAction(gameId, action);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao executar ação' });
    }
  };
}
