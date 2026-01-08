'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
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
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-xl flex-1 flex items-center justify-center">
          {children}
        </div>

        {/* Footer */}
        <div className="w-full max-w-xl pb-6">
          <p className="text-center text-gray-400 text-sm">Made by Vinicius Pascoal</p>
        </div>
      </main>
    </div>
  );
}
