'use client';

import Image from 'next/image';
import { Role } from '@/types/game.types';

interface RoleCardProps {
  role: Role | undefined;
}

export function RoleCard({ role }: RoleCardProps) {
  if (!role) {
    role = Role.CIDADAO;
  }

  const getRoleLabel = (r: Role) => {
    const labels: Record<Role, string> = {
      [Role.ASSASSINO]: 'Assassino',
      [Role.LIDER_ASSASSINOS]: 'Líder dos Assassinos',
      [Role.SUICIDA]: 'Suicida',
      [Role.DETETIVE]: 'Detetive',
      [Role.VIDENTE]: 'Vidente',
      [Role.MEDICO]: 'Médico',
      [Role.BRUXA]: 'Bruxa',
      [Role.JUIZ]: 'Juiz',
      [Role.DELEGADO]: 'Delegado',
      [Role.FANTASMA]: 'Fantasma',
      [Role.CIDADAO]: 'Cidadão',
    };
    return labels[r];
  };

  const getRoleColor = (r: Role) => {
    const colors: Record<Role, string> = {
      [Role.ASSASSINO]: 'from-red-900 to-red-700',
      [Role.LIDER_ASSASSINOS]: 'from-red-800 to-red-600',
      [Role.SUICIDA]: 'from-pink-900 to-pink-700',
      [Role.DETETIVE]: 'from-blue-900 to-blue-700',
      [Role.VIDENTE]: 'from-purple-900 to-purple-700',
      [Role.MEDICO]: 'from-green-900 to-green-700',
      [Role.BRUXA]: 'from-indigo-900 to-indigo-700',
      [Role.JUIZ]: 'from-yellow-900 to-yellow-700',
      [Role.DELEGADO]: 'from-cyan-900 to-cyan-700',
      [Role.FANTASMA]: 'from-gray-900 to-gray-700',
      [Role.CIDADAO]: 'from-slate-800 to-slate-700',
    };
    return colors[r];
  };

  const getRoleSvgPath = (r: Role): string => {
    const svgPaths: Record<Role, string> = {
      [Role.ASSASSINO]: '/images/roles/assassino.svg',
      [Role.LIDER_ASSASSINOS]: '/images/roles/assassino lider.svg',
      [Role.SUICIDA]: '/images/roles/suicida.svg',
      [Role.DETETIVE]: '/images/roles/detetive.svg',
      [Role.VIDENTE]: '/images/roles/vidente.svg',
      [Role.MEDICO]: '/images/roles/medico.svg',
      [Role.BRUXA]: '/images/roles/bruxa.svg',
      [Role.JUIZ]: '/images/roles/juiz.svg',
      [Role.DELEGADO]: '/images/roles/delegado.svg',
      [Role.FANTASMA]: '/images/roles/fantasma.svg',
      [Role.CIDADAO]: '/images/roles/cidadao.svg',
    };
    return svgPaths[r];
  };

  return (
    <div className={`bg-gradient-to-br ${getRoleColor(role)} rounded-3xl p-8 shadow-2xl border-2 border-white/20 flex flex-col items-center gap-6`}>
      {/* Ícone da Role */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <Image
          src={getRoleSvgPath(role)}
          alt={getRoleLabel(role)}
          width={128}
          height={128}
          className="object-contain drop-shadow-lg"
        />
      </div>

      {/* Nome da Role */}
      <div className="text-center">
        <p className="text-white text-2xl font-bold">{getRoleLabel(role)}</p>
      </div>
    </div>
  );
}
