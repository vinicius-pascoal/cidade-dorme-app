export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="flex flex-col items-center justify-center gap-8 px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            🏙️ Cidade Dorme
          </h1>
          <p className="text-xl text-gray-300">
            Jogo de Dedução Social Multiplayer
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <button className="w-full py-4 px-8 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg transition-colors">
            Criar Sala
          </button>

          <button className="w-full py-4 px-8 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition-colors">
            Entrar em uma Sala
          </button>
        </div>
      </main>
    </div>
  );
}
