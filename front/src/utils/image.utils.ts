/**
 * Utilitários para acesso às imagens do jogo
 */

export const BACKGROUNDS = {
  NIGHT: '/images/backgrounds/night.jpg',
  DAY: '/images/backgrounds/day.jpg',
} as const;

export const ROLE_ICONS = {
  VILLAGER: '/images/roles/villager.png',
  WEREWOLF: '/images/roles/werewolf.png',
  SEER: '/images/roles/seer.png',
  DOCTOR: '/images/roles/doctor.png',
  HUNTER: '/images/roles/hunter.png',
  CUPID: '/images/roles/cupid.png',
  WITCH: '/images/roles/witch.png',
  GUARD: '/images/roles/guard.png',
} as const;

/**
 * Obtém o caminho da imagem de fundo baseado na fase do jogo
 */
export const getBackgroundImage = (phase: 'day' | 'night'): string => {
  return phase === 'night' ? BACKGROUNDS.NIGHT : BACKGROUNDS.DAY;
};

/**
 * Obtém o caminho do ícone de um role
 */
export const getRoleIcon = (role: string): string => {
  const roleKey = role.toUpperCase() as keyof typeof ROLE_ICONS;
  return ROLE_ICONS[roleKey] || ROLE_ICONS.VILLAGER;
};
