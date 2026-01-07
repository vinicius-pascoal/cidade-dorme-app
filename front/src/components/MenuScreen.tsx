'use client';

import { useGame } from '@/context/GameContext';

export function MenuScreen() {
  const { setScreen, resetMessages } = useGame();

  return (
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
  );
}
