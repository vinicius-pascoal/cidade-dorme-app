import dotenv from 'dotenv';
import path from 'path';

// Testa diferentes formas de carregar o .env
console.log('=== TESTE DE CARREGAMENTO DO .ENV ===\n');

console.log('1. Caminho atual:', __dirname);
console.log('2. Caminho do .env:', path.resolve(__dirname, '../.env'));

// Tenta carregar explicitamente
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.log('❌ Erro ao carregar .env:', result.error);
} else {
  console.log('✅ .env carregado com sucesso');
}

console.log('\n=== VARIÁVEIS DE AMBIENTE ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ABLY_API_KEY:', process.env.ABLY_API_KEY);

console.log('\n=== TODAS AS VARIÁVEIS ===');
Object.keys(process.env)
  .filter(key => key.includes('ABLY') || key === 'PORT' || key === 'NODE_ENV')
  .forEach(key => {
    console.log(`${key}:`, process.env[key]);
  });
