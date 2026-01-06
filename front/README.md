# 🏙️ Cidade Dorme - Frontend

Frontend do jogo Cidade Dorme construído com Next.js 16, React 19 e TypeScript.

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- npm ou yarn

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env.local
```

2. Configure as variáveis de ambiente em `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ABLY_API_KEY=your-ably-key-here
```

### Desenvolvimento

```bash
npm run dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000)

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
front/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   ├── config/           # Configurações e constantes
│   │   └── constants.ts  # Constantes da aplicação
│   ├── lib/              # Bibliotecas e utilidades
│   │   └── api-client.ts # Cliente HTTP para API
│   ├── services/         # Serviços de API
│   │   └── game.service.ts
│   ├── types/            # Tipos TypeScript
│   │   └── game.types.ts # Tipos do jogo
│   └── utils/            # Funções utilitárias
│       └── game.utils.ts
├── public/               # Arquivos estáticos
└── ...                   # Arquivos de configuração
```

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Ably** - Comunicação real-time

## 📝 Recursos Principais

- ✅ Configuração base completa
- ✅ Cliente API tipado
- ✅ Serviços de jogo
- ✅ Tipos e interfaces
- ✅ Utilitários do jogo
- ✅ Layout responsivo
- ✅ Tema dark customizado

## 🎨 Estilização

O projeto usa Tailwind CSS 4 com uma paleta de cores customizada focada em tons escuros e roxos para criar uma atmosfera adequada ao tema do jogo.

## 🔗 API

O frontend se comunica com o backend através de uma API REST. As configurações estão em `src/config/constants.ts` e os serviços em `src/services/`.

## 📄 Licença

Este projeto é open source.
