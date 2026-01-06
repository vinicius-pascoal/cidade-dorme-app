import dotenv from 'dotenv';

// Carrega variáveis de ambiente PRIMEIRO
dotenv.config();

// Log para debug
console.log('🔧 Variáveis de ambiente carregadas:');
console.log('   PORT:', process.env.PORT || '3001');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   ABLY_API_KEY:', process.env.ABLY_API_KEY ? '✅ Configurada' : '❌ Não encontrada');

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import gameRoutes from './routes/game.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Cidade Dorme API',
}));

// Routes
app.use('/api/game', gameRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cidade Dorme Backend is running' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`🏙️ Cidade Dorme - Backend iniciado`);
  console.log(`📚 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});
