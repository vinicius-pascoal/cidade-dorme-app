'use client';

import { useState } from 'react';
import { Game } from '@/types/game.types';
import { QRCode } from './QRCode';
import { Modal } from './Modal';

interface RoomScreenProps {
  game: Game;
  playerId: string | null;
  onBack: () => void;
}

export function RoomScreen({ game, playerId, onBack }: RoomScreenProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(game.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código:', error);
    }
  };

  const isHost = playerId === game.hostId;

  return (
    <>
      <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">🎮 Sala Criada!</h2>

        {/* Código da Sala */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border-2 border-purple-500">
          <p className="text-gray-300 text-center mb-3 font-medium">Código da Sala</p>
          <p className="text-5xl font-bold text-purple-400 text-center tracking-widest mb-6">
            {game.code}
          </p>
          <button
            onClick={handleCopyCode}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors"
          >
            {copied ? '✅ Copiado!' : '📋 Copiar Código'}
          </button>
        </div>

        {/* Botão QR Code */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mb-6 transition-colors flex items-center justify-center gap-2"
        >
          📱 Abrir QR Code
        </button>

        {/* Jogadores */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">👥 Jogadores ({game.players.length})</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {game.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
              >
                <span className="text-white font-medium">{player.name}</span>
                {player.isHost && <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">HOST</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          {isHost && (
            <button className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              🎮 Iniciar Jogo
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Modal QR Code */}
      <Modal
        isOpen={showQR}
        title="📱 QR Code da Sala"
        onClose={() => setShowQR(false)}
      >
        <div className="flex flex-col items-center gap-4">
          <QRCode value={`${typeof window !== 'undefined' ? window.location.origin : 'https://cidade-dorme.app'}?join=${game.code}`} />
          <p className="text-gray-400 text-sm text-center">
            Escaneie com o celular para entrar na sala
          </p>
        </div>
      </Modal>
    </>
  );
}
