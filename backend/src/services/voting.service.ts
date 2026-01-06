import { Game, Player, Role, VotingResult } from '../types/game.types';

export class VotingService {
  /**
   * Registra o voto de um jogador
   */
  public castVote(game: Game, voterId: string, targetId: string): void {
    const voter = game.players.find(p => p.id === voterId);
    const target = game.players.find(p => p.id === targetId);

    if (!voter || !voter.isAlive) {
      throw new Error('Votante inválido ou morto');
    }

    if (!target || !target.isAlive) {
      throw new Error('Alvo inválido ou morto');
    }

    // Registra o voto
    voter.votedFor = targetId;
    game.currentVotes.set(voterId, targetId);
  }

  /**
   * Processa a votação e determina quem foi eliminado
   */
  public processVoting(game: Game): VotingResult {
    const voteCounts = this.countVotes(game);
    const maxVotes = Math.max(...Array.from(voteCounts.values()));

    // Encontra todos os jogadores com mais votos
    const topCandidates = Array.from(voteCounts.entries())
      .filter(([_, count]) => count === maxVotes)
      .map(([playerId, _]) => playerId);

    const result: VotingResult = {
      votes: this.organizeVotesByTarget(game),
      isTie: topCandidates.length > 1,
      eliminated: null,
    };

    // Se há empate, verifica se existe juiz
    if (result.isTie) {
      const judgeDecision = this.getJudgeDecision(game, topCandidates);

      if (judgeDecision) {
        result.judgeDecision = judgeDecision;
        result.eliminated = judgeDecision;
      } else {
        // Empate sem juiz = ninguém é eliminado
        result.eliminated = null;
      }
    } else {
      // Sem empate, elimina o mais votado
      result.eliminated = topCandidates[0];
    }

    // Marca o jogador como morto
    if (result.eliminated) {
      const eliminatedPlayer = game.players.find(p => p.id === result.eliminated);
      if (eliminatedPlayer) {
        eliminatedPlayer.isAlive = false;
      }
    }

    // Salva resultado no histórico
    game.votingHistory.push(result);

    // Limpa votos
    game.currentVotes.clear();
    game.players.forEach(p => p.votedFor = null);

    return result;
  }

  /**
   * Conta os votos considerando o voto duplo do Delegado
   */
  private countVotes(game: Game): Map<string, number> {
    const counts = new Map<string, number>();

    game.players.forEach(voter => {
      if (!voter.isAlive || !voter.votedFor) {
        return;
      }

      const currentCount = counts.get(voter.votedFor) || 0;
      const voteWeight = this.getVoteWeight(voter);

      counts.set(voter.votedFor, currentCount + voteWeight);
    });

    return counts;
  }

  /**
   * Retorna o peso do voto (2 para Delegado, 1 para os demais)
   */
  private getVoteWeight(player: Player): number {
    return player.role === Role.DELEGADO ? 2 : 1;
  }

  /**
   * Organiza os votos por alvo para visualização
   */
  private organizeVotesByTarget(game: Game): Map<string, string[]> {
    const organized = new Map<string, string[]>();

    game.players.forEach(voter => {
      if (!voter.isAlive || !voter.votedFor) {
        return;
      }

      const voters = organized.get(voter.votedFor) || [];
      voters.push(voter.id);
      organized.set(voter.votedFor, voters);
    });

    return organized;
  }

  /**
   * Obtém a decisão do juiz em caso de empate
   */
  private getJudgeDecision(game: Game, candidates: string[]): string | null {
    const judge = game.players.find(
      p => p.role === Role.JUIZ && p.isAlive
    );

    if (!judge || !judge.votedFor) {
      return null;
    }

    // O juiz deve ter votado em um dos empatados
    if (candidates.includes(judge.votedFor)) {
      return judge.votedFor;
    }

    return null;
  }

  /**
   * Verifica se todos os jogadores vivos votaram
   */
  public hasAllPlayersVoted(game: Game): boolean {
    const alivePlayers = game.players.filter(p => p.isAlive);
    const votedCount = game.players.filter(p => p.isAlive && p.votedFor).length;

    return votedCount === alivePlayers.length;
  }

  /**
   * Retorna o status atual da votação
   */
  public getVotingStatus(game: Game): {
    totalPlayers: number;
    votedCount: number;
    missingVotes: string[];
  } {
    const alivePlayers = game.players.filter(p => p.isAlive);
    const votedPlayers = game.players.filter(p => p.isAlive && p.votedFor);
    const missingVotes = alivePlayers
      .filter(p => !p.votedFor)
      .map(p => p.id);

    return {
      totalPlayers: alivePlayers.length,
      votedCount: votedPlayers.length,
      missingVotes,
    };
  }

  /**
   * Cancela um voto específico
   */
  public cancelVote(game: Game, voterId: string): void {
    const voter = game.players.find(p => p.id === voterId);

    if (voter) {
      voter.votedFor = null;
      game.currentVotes.delete(voterId);
    }
  }

  /**
   * Retorna a contagem atual de votos (para exibição em tempo real)
   */
  public getCurrentVoteCounts(game: Game): Map<string, number> {
    return this.countVotes(game);
  }
}
