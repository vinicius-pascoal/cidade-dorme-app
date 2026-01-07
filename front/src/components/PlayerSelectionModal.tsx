'use client';

interface PlayerSelectionModalProps {
  isOpen: boolean;
  players: Array<{ id: string; name: string }>;
  selectedPlayerId: string | null;
  onSelect: (playerId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

export function PlayerSelectionModal({
  isOpen,
  players,
  selectedPlayerId,
  onSelect,
  onConfirm,
  onCancel,
  title,
}: PlayerSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>

        {/* Lista de jogadores */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => onSelect(player.id)}
              className={`w-full p-4 rounded-lg font-semibold transition-all ${selectedPlayerId === player.id
                  ? 'bg-purple-600 text-white border-2 border-purple-400'
                  : 'bg-slate-700 text-white hover:bg-slate-600 border-2 border-transparent'
                }`}
            >
              {selectedPlayerId === player.id && '✓ '}
              {player.name}
            </button>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={!selectedPlayerId}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Confirmar
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            ✗ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
