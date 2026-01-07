'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { gameService } from '@/services/game.service';
import { RoomScreen } from '@/components/RoomScreen';
import { Game } from '@/types/game.types';

type Screen = 'menu' | 'create' | 'join' | 'room';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

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
  }, [playerName]);

  const handleJoinRoom = useCallback(async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    resetMessages();
    setIsLoading(true);
    try {
      const { game: joinedGame, playerId: newPlayerId } = await gameService.joinGame(
        roomCode.trim().toUpperCase(),
        playerName.trim()
      );
      setGame(joinedGame);
      setPlayerId(newPlayerId);
      setScreen('room');
    } catch (err: any) {
      setError(err?.message || 'Não foi possível entrar na sala.');
    } finally {
      setIsLoading(false);
    }
  }, [playerName, roomCode]);

  const handleCopyCode = useCallback(async () => {
    if (!game?.code || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(game.code);
      setInfo('Código copiado!');
    } catch (err: any) {
      setError(err?.message || 'Não foi possível copiar o código.');
    }
  }, [game?.code]);

  const currentPlayers = useMemo(() => game?.players ?? [], [game]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/nightNew.png"
          alt="Fundo noturno"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-between p-4 sm:p-6">
        {/* Header */}
        <div className="w-full max-w-xl pt-8 sm:pt-12">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
              Cidade Dorme
            </h1>
            <p className="text-gray-200">Dedução social em tempo real</p>
          </div>
        </div>

        {/* Main Area */}
        <div className="w-full max-w-xl flex-1 flex items-center justify-center">
          {screen === 'menu' && (
            <div className="w-full space-y-4 px-4">
              <button
                onClick={() => {
                  resetMessages();
                  setScreen('create');
                }}
                className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
              >
                ✨ Criar Sala
              </button>

              <button
                onClick={() => {
                  resetMessages();
                  setScreen('join');
                }}
                className="w-full py-5 px-8 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
              >
                🚪 Entrar na Sala
              </button>

              <button
                className="w-full py-4 px-8 bg-transparent border-2 border-gray-400 hover:border-gray-300 text-gray-300 hover:text-white text-lg font-semibold rounded-2xl transition-all"
              >
                📖 Como Jogar
              </button>
            </div>
          )}

          {screen === 'create' && (
            <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                Criar Nova Sala
              </h2>

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
                  Voltar
                </button>
              </div>
            </div>
          )}

          {screen === 'join' && (
            <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                Entrar na Sala
              </h2>

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

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Código da Sala</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="w-full px-4 py-3 bg-slate-800 text-white text-center text-2xl font-bold rounded-xl border-2 border-slate-700 focus:border-purple-500 outline-none transition-colors tracking-widest"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!playerName.trim() || !roomCode.trim() || isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>

                <button
                  onClick={() => setScreen('menu')}
                  className="w-full py-3 px-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {screen === 'room' && game && (
            <RoomScreen
              game={game}
              playerId={playerId}
              onBack={() => {
                setScreen('menu');
                setGame(null);
                setPlayerId(null);
                setPlayerName('');
                setRoomCode('');
              }}
            />
          )}
        </div>

        {/* Status / Lobby */}
        {screen !== 'room' && (
        <div className="w-full max-w-xl space-y-3 pb-6">
          {error && (
            <div className="w-full rounded-xl bg-red-500/80 text-white px-4 py-3 text-sm shadow-lg">
              {error}
            </div>
          )}
          {info && (
            <div className="w-full rounded-xl bg-emerald-600/80 text-white px-4 py-3 text-sm shadow-lg">
              {info}
            </div>
          )}

          <p className="text-center text-gray-400 text-sm">Made by Vinicius Pascoal</p>
        </div>
        )}
      </main>
    </div>
  );
}
