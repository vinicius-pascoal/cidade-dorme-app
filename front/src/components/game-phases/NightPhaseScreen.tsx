'use client';

import { useState, useCallback } from 'react';
import { Game, Role } from '@/types/game.types';
import { RoleCard } from '../RoleCard';
import { PlayerSelectionModal } from '../PlayerSelectionModal';
import { gameService } from '@/services/game.service';

interface NightPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

interface NightAction {
  id: string;
  name: string;
  description: string;
  requiresTarget: boolean;
  icon: string;
}

export function NightPhaseScreen({ game, playerId }: NightPhaseScreenProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<NightAction | null>(null);
  const [hasActed, setHasActed] = useState(false);
  const [actionPerformed, setActionPerformed] = useState<{
    actionName: string;
    targetName?: string;
    investigationResult?: { targetName: string; isVillain: boolean };
    seerResult?: { targetName: string; role: string };
  } | null>(null);

  const currentPlayer = game.players.find(p => p.id === playerId);

  const getNightActions = (): NightAction[] => {
    const actions: NightAction[] = [
      {
        id: 'skip',
        name: 'Não fazer nada',
        description: 'Passe sua vez esta noite',
        requiresTarget: false,
        icon: '😴',
      },
    ];

    if (!currentPlayer?.role) return actions;

    const roleActions: Record<string, NightAction[]> = {
      [Role.ASSASSINO]: [
        {
          id: 'assassinate',
          name: 'Assassinar',
          description: 'Elimine um cidadão durante a noite',
          requiresTarget: true,
          icon: '🗡️',
        },
      ],
      [Role.LIDER_ASSASSINOS]: [
        {
          id: 'assassinate',
          name: 'Assassinar',
          description: 'Elimine um cidadão durante a noite',
          requiresTarget: true,
          icon: '🗡️',
        },
      ],
      [Role.MEDICO]: [
        {
          id: 'heal',
          name: 'Curar',
          description: 'Proteja um jogador de ser assassinado',
          requiresTarget: true,
          icon: '❤️',
        },
      ],
      [Role.DETETIVE]: [
        {
          id: 'investigate',
          name: 'Investigar',
          description: 'Descubra o papel de um jogador',
          requiresTarget: true,
          icon: '🔍',
        },
      ],
      [Role.VIDENTE]: [
        {
          id: 'reveal',
          name: 'Revelar',
          description: 'Veja o papel de um jogador',
          requiresTarget: true,
          icon: '👁️',
        },
      ],
      [Role.BRUXA]: [
        {
          id: 'heal',
          name: 'Curar',
          description: 'Salve alguém de ser eliminado',
          requiresTarget: true,
          icon: '🧙‍♀️',
        },
        {
          id: 'kill',
          name: 'Envenenar',
          description: 'Elimine alguém',
          requiresTarget: true,
          icon: '☠️',
        },
      ],
    };

    return [...actions, ...(roleActions[currentPlayer.role] || [])];
  };

  const handleActionClick = useCallback((action: NightAction) => {
    if (action.requiresTarget) {
      setPendingAction(action);
      setShowTargetModal(true);
    } else {
      // Ação sem alvo (ex: pular)
      handleSkipAction(action);
    }
  }, []);

  const handleSkipAction = useCallback(async (action: NightAction) => {
    if (!playerId) return;

    try {
      // Skip envia uma ação SKIP para o backend
      const response = await gameService.executeNightAction(game.id, playerId, 'SKIP');
      setActionPerformed({
        actionName: action.name
      });
      setHasActed(true);
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    }
  }, [playerId, game.id]);

  const mapActionIdToType = (actionId: string): string => {
    const actionMap: Record<string, string> = {
      'skip': 'SKIP',
      'assassinate': 'ASSASSIN_KILL',
      'heal': 'DOCTOR_SAVE',
      'investigate': 'DETECTIVE_INVESTIGATE',
      'reveal': 'SEER_REVEAL',
      'kill': 'WITCH_KILL',
    };
    return actionMap[actionId] || actionId;
  };

  const handleConfirmTarget = useCallback(async () => {
    if (!pendingAction || !selectedTarget || !playerId) return;

    try {
      const targetPlayer = game.players.find(p => p.id === selectedTarget);
      const actionType = mapActionIdToType(pendingAction.id);

      const response = await gameService.executeNightAction(
        game.id,
        playerId,
        actionType,
        selectedTarget
      );

      const baseAction = {
        actionName: pendingAction.name,
        targetName: targetPlayer?.name
      };

      // Se houver resultado de investigação, adiciona à resposta
      if (response.result?.investigationResult) {
        setActionPerformed({
          ...baseAction,
          investigationResult: {
            targetName: response.result.investigationResult.targetName,
            isVillain: response.result.investigationResult.isVillain,
          },
        });
      }
      // Se houver resultado de vidente, adiciona à resposta
      else if (response.result?.seerResult) {
        setActionPerformed({
          ...baseAction,
          seerResult: {
            targetName: response.result.seerResult.targetName,
            role: response.result.seerResult.role,
          },
        });
      }
      // Caso padrão
      else {
        setActionPerformed(baseAction);
      }

      setShowTargetModal(false);
      setPendingAction(null);
      setSelectedTarget(null);
      setHasActed(true);
    } catch (error) {
      console.error('Erro ao executar ação com alvo:', error);
    }
  }, [pendingAction, selectedTarget, playerId, game]);

  const nightActions = getNightActions();
  const aliveOtherPlayers = game.players.filter(p => p.isAlive && p.id !== playerId);

  // Se o jogador já agiu, mostrar tela de aguardamento
  if (hasActed) {
    return (
      <div className="w-full space-y-6">
        {/* Sua Role */}
        <RoleCard role={currentPlayer?.role} />

        {/* Tela de Aguardamento */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-purple-500/30">
          <div className="text-center space-y-6">
            {/* Ícone de Checkmark */}
            <div className="text-7xl mb-4">✅</div>

            {/* Mensagem de Ação Realizada */}
            <div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">Ação Realizada!</h3>
              <p className="text-white text-lg">
                {actionPerformed?.targetName
                  ? `${actionPerformed.actionName} em ${actionPerformed.targetName}`
                  : actionPerformed?.actionName
                }
              </p>

              {/* Resultado de Investigação */}
              {actionPerformed?.investigationResult && (
                <div className="mt-6 bg-blue-900/30 border-2 border-blue-500/50 rounded-2xl p-6">
                  <p className="text-blue-200 font-semibold mb-2">🔍 Resultado da Investigação:</p>
                  <p className="text-white text-lg font-bold mb-1">
                    {actionPerformed.investigationResult.targetName}
                  </p>
                  <p className={`text-lg font-bold ${actionPerformed.investigationResult.isVillain
                      ? 'text-red-400'
                      : 'text-green-400'
                    }`}>
                    {actionPerformed.investigationResult.isVillain ? '⚠️ É um Vilão!' : '✅ É um Cidadão'}
                  </p>
                </div>
              )}

              {/* Resultado de Vidente */}
              {actionPerformed?.seerResult && (
                <div className="mt-6 bg-purple-900/30 border-2 border-purple-500/50 rounded-2xl p-6">
                  <p className="text-purple-200 font-semibold mb-2">👁️ Papel Revelado:</p>
                  <p className="text-white text-lg font-bold mb-1">
                    {actionPerformed.seerResult.targetName}
                  </p>
                  <p className="text-purple-300 text-lg font-bold">
                    {actionPerformed.seerResult.role}
                  </p>
                </div>
              )}
            </div>

            {/* Aguardando */}
            <div className="mt-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-gray-300 text-xl font-semibold">
                Aguardando os outros jogadores...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Não feche esta página
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-6">
        {/* Sua Role */}
        <RoleCard role={currentPlayer?.role} />

        {/* Ações Disponíveis */}
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🌙 Escolha sua ação</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nightActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-purple-500 rounded-2xl p-6 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <p className="text-white font-bold text-lg mb-2">{action.name}</p>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dica */}
        <div className="text-center text-gray-400 text-sm">
          Escolha sua ação rapidamente!
        </div>
      </div>

      {/* Modal de Seleção de Jogador */}
      <PlayerSelectionModal
        isOpen={showTargetModal}
        players={aliveOtherPlayers.map(p => ({ id: p.id, name: p.name }))}
        selectedPlayerId={selectedTarget}
        onSelect={setSelectedTarget}
        onConfirm={handleConfirmTarget}
        onCancel={() => {
          setShowTargetModal(false);
          setPendingAction(null);
          setSelectedTarget(null);
        }}
        title={pendingAction ? `Selecione alvo para: ${pendingAction.name}` : 'Selecione um jogador'}
      />
    </>
  );
}
