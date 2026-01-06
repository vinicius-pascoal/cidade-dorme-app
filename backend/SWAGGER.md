# 📚 Documentação Swagger - Cidade Dorme API

## 🚀 Como Acessar

Após iniciar o servidor backend:

```bash
cd backend
npm install
npm run dev
```

Acesse: **http://localhost:3001/api-docs**

## ✨ Recursos do Swagger UI

### 1. **Visualização Completa da API**
- Todos os endpoints documentados
- Schemas de dados
- Exemplos de requisições e respostas

### 2. **Teste Interativo**
- Clique em qualquer endpoint
- Clique no botão "Try it out"
- Preencha os parâmetros necessários
- Execute a requisição diretamente do navegador

### 3. **Exemplos Práticos**

#### Criar um Jogo
```
POST /api/game/create
Body: { "hostName": "João" }
```

#### Entrar no Jogo
```
POST /api/game/join
Body: { "code": "ABC123", "playerName": "Maria" }
```

#### Realizar Ação Noturna
```
POST /api/game/{gameId}/night-action
Body: {
  "playerId": "player123",
  "actionType": "ASSASSIN_KILL",
  "targetId": "player456"
}
```

## 📋 Tags Organizadas

A documentação está organizada em 4 categorias principais:

1. **Game Management** - Criação e gerenciamento de jogos
2. **Night Actions** - Ações da fase noturna
3. **Voting** - Sistema de votação
4. **Phase Control** - Controle de fases do jogo

## 🎭 Tipos de Ação Noturna

Documentados no Swagger:

- `ASSASSIN_KILL` - Assassinos matam
- `DOCTOR_SAVE` - Médico salva
- `DETECTIVE_INVESTIGATE` - Detetive investiga
- `SEER_REVEAL` - Vidente revela papel
- `WITCH_HEAL` - Bruxa cura
- `WITCH_KILL` - Bruxa mata

## 🔄 Fases do Jogo

- `LOBBY` - Aguardando jogadores
- `NIGHT` - Fase noturna
- `DAY_DISCUSSION` - Discussão
- `DAY_VOTING` - Votação
- `ENDED` - Jogo finalizado

## 💡 Dicas de Uso

1. **Explore os Schemas**: Clique em "Schemas" no final da página para ver todos os tipos de dados

2. **Teste o Fluxo Completo**:
   - Criar jogo
   - Adicionar jogadores (10-12)
   - Iniciar jogo
   - Realizar ações noturnas
   - Votar
   - Avançar fases

3. **Copie os IDs**: Ao criar/entrar em um jogo, copie os IDs retornados para usar nos próximos endpoints

4. **Verifique Respostas de Erro**: Cada endpoint documenta os possíveis erros (400, 404, etc.)

## 🛠️ Tecnologias Utilizadas

- **swagger-jsdoc**: Gera especificação OpenAPI a partir de comentários JSDoc
- **swagger-ui-express**: Serve interface Swagger UI no Express

## 📝 Manutenção

Para adicionar novos endpoints à documentação:

1. Adicione comentários JSDoc no arquivo de rotas
2. Siga o formato OpenAPI 3.0
3. Reinicie o servidor para ver as mudanças

Exemplo:
```javascript
/**
 * @swagger
 * /api/game/novo-endpoint:
 *   post:
 *     tags:
 *       - Game Management
 *     summary: Descrição curta
 *     description: Descrição detalhada
 *     ...
 */
```

## 🎯 Próximos Passos

- [ ] Adicionar autenticação JWT (se necessário)
- [ ] Documentar eventos WebSocket/Ably
- [ ] Adicionar rate limiting
- [ ] Exemplos de código para clientes

## 📄 Exportar Documentação

A especificação OpenAPI pode ser acessada em formato JSON:

```
http://localhost:3001/api-docs/swagger.json
```

Use este arquivo para:
- Gerar clientes automaticamente (Postman, Insomnia)
- Integrar com ferramentas CI/CD
- Compartilhar com frontend team
