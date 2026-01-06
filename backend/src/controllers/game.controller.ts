import { Request, Response } from 'express';
import { GameService } from '../services/game.service';

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  /**
   * POST /games - Cria um novo jogo
   */
  createGame = async (req: Request, res: Response) => {
    try {
      const { hostName } = req.body;

      if (!hostName) {
        return res.status(400).json({ error: 'Nome do host é obrigatório' });
      }

      const game = await this.gameService.createGame(hostName);
      res.status(201).json(game);
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      res.status(500).json({ error: 'Erro ao criar jogo' });
    }
  };

  /**
   * POST /games/join - Entra em um jogo existente
   */
  joinGame = async (req: Request, res: Response) => {
    try {
      const { code, playerName } = req.body;

      if (!code || !playerName) {
        return res.status(400).json({ error: 'Código do jogo e nome do jogador são obrigatórios' });
      }

      const result = await this.gameService.joinGame(code, playerName);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro ao entrar no jogo:', error);
      res.status(400).json({ error: error.message || 'Erro ao entrar no jogo' });
    }
  };

  /**
   * GET /games/:gameId - Obtém informações do jogo
   */
  getGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const game = await this.gameService.getGame(gameId);
      res.status(200).json(game);
    } catch (error) {
      console.error('Erro ao buscar jogo:', error);
      res.status(404).json({ error: 'Jogo não encontrado' });
    }
  };

  /**
   * GET /games/:gameId/player/:playerId - Obtém informações do jogo para um jogador
   */
  getGameForPlayer = async (req: Request, res: Response) => {
    try {
      const { gameId, playerId } = req.params;
      const result = await this.gameService.getGameForPlayer(gameId, playerId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro ao buscar jogo para jogador:', error);
      res.status(404).json({ error: error.message || 'Erro ao buscar informações' });
    }
  };

  /**
   * POST /games/:gameId/start - Inicia o jogo
   */
  startGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { hostId } = req.body;

      if (!hostId) {
        return res.status(400).json({ error: 'ID do host é obrigatório' });
      }

      const game = await this.gameService.startGame(gameId, hostId);
      res.status(200).json({ success: true, game });
    } catch (error: any) {
      console.error('Erro ao iniciar jogo:', error);
      res.status(400).json({ error: error.message || 'Erro ao iniciar jogo' });
    }
  };

  /**
   * POST /games/:gameId/night-action - Realiza ação noturna
   */
  performNightAction = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { playerId, actionType, targetId } = req.body;

      if (!playerId || !actionType) {
        return res.status(400).json({ error: 'PlayerId e actionType são obrigatórios' });
      }

      await this.gameService.performNightAction(gameId, playerId, {
        actionType,
        targetId,
      });

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Erro ao realizar ação noturna:', error);
      res.status(400).json({ error: error.message || 'Erro ao realizar ação' });
    }
  };

  /**
   * POST /games/:gameId/end-night - Finaliza a fase noturna
   */
  endNight = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const result = await this.gameService.processNightEnd(gameId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro ao finalizar noite:', error);
      res.status(400).json({ error: error.message || 'Erro ao finalizar noite' });
    }
  };

  /**
   * POST /games/:gameId/vote - Registra um voto
   */
  castVote = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { voterId, targetId } = req.body;

      if (!voterId || !targetId) {
        return res.status(400).json({ error: 'VoterId e targetId são obrigatórios' });
      }

      await this.gameService.castVote(gameId, voterId, targetId);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Erro ao registrar voto:', error);
      res.status(400).json({ error: error.message || 'Erro ao registrar voto' });
    }
  };

  /**
   * POST /games/:gameId/end-voting - Finaliza a votação
   */
  endVoting = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const result = await this.gameService.processVotingEnd(gameId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro ao finalizar votação:', error);
      res.status(400).json({ error: error.message || 'Erro ao finalizar votação' });
    }
  };

  /**
   * POST /games/:gameId/advance-phase - Avança a fase (host)
   */
  advancePhase = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { hostId } = req.body;

      if (!hostId) {
        return res.status(400).json({ error: 'ID do host é obrigatório' });
      }

      await this.gameService.advancePhase(gameId, hostId);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Erro ao avançar fase:', error);
      res.status(400).json({ error: error.message || 'Erro ao avançar fase' });
    }
  };
}
