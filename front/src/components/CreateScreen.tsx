'use client';

import { useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { gameService } from '@/services/game.service';

export function CreateScreen() {
  const {
    playerName,
    setPlayerName,
    setGame,
    setPlayerId,
    setScreen,
    setError,
    setIsLoading,
    isLoading,
    resetMessages,
  } = useGame();

  const handleCreateRoom = useCallback(async () => {
    if (!playerName.trim()) return;
    resetMessages();
    setIsLoading(true);
    try {
      const createdGame = await gameService.createGame(playerName.trim());
      setGame(createdGame);
      setPlayerId(createdGame.hostId || null);
      setScreen('room');
    } catch (err: any) {
      setError(err?.message || 'Não foi possível criar a sala.');
    } finally {
      setIsLoading(false);
    }
  }, [playerName, setGame, setPlayerId, setScreen, setError, setIsLoading, resetMessages]);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Criar Nova Sala</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Seu Nome</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border-2 border-slate-700 focus:border-purple-500 outline-none transition-colors"
            maxLength={20}
          />
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!playerName.trim() || isLoading}
        >
          {isLoading ? 'Criando...' : 'Criar Sala'}
        </button>

        <button
          onClick={() => setScreen('menu')}
          className="w-full py-3 px-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
