'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BACKGROUNDS } from '@/utils/image.utils';

export default function Home() {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/night.png"
          alt="Fundo noturno"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-between p-4 sm:p-6">
        {/* Header */}
        <div className="w-full max-w-md pt-8 sm:pt-12">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 drop-shadow-2xl animate-pulse">
              Cidade Dorme
            </h1>
          </div>
        </div>

        {/* Main Menu */}
        <div className="w-full max-w-md flex-1 flex items-center justify-center">
          {!showCreateRoom && !showJoinRoom ? (
            <div className="w-full space-y-4 px-4">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
              >
                ✨ Criar Sala
              </button>

              <button
                onClick={() => setShowJoinRoom(true)}
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
          ) : showCreateRoom ? (
            <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                Criar Nova Sala
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Seu Nome
                  </label>
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
                  className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!playerName.trim()}
                >
                  Criar Sala
                </button>

                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="w-full py-3 px-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                Entrar na Sala
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Seu Nome
                  </label>
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
                  <label className="block text-gray-300 mb-2 font-medium">
                    Código da Sala
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="XXXX"
                    className="w-full px-4 py-3 bg-slate-800 text-white text-center text-2xl font-bold rounded-xl border-2 border-slate-700 focus:border-purple-500 outline-none transition-colors tracking-widest"
                    maxLength={6}
                  />
                </div>

                <button
                  className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!playerName.trim() || !roomCode.trim()}
                >
                  Entrar
                </button>

                <button
                  onClick={() => setShowJoinRoom(false)}
                  className="w-full py-3 px-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full max-w-md pb-6">
          <p className="text-center text-gray-400 text-sm">
            Made by Vinicius Pascoal
          </p>
        </div>
      </main>
    </div>
  );
}
