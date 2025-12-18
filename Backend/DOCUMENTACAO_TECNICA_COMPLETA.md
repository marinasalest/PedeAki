# Documentação Técnica Completa - Pede Aki

## 1. Visão Geral do Projeto

O **Pede Aki** é um sistema completo de delivery de alimentos desenvolvido para o mercado brasileiro. A aplicação permite que usuários façam pedidos de comida de restaurantes cadastrados, acompanhem o status em tempo real, realizem pagamentos e avaliem o serviço.

### 1.1. Objetivo

Fornecer uma plataforma completa de delivery que conecta clientes a restaurantes, oferecendo:
- Interface intuitiva para busca e seleção de restaurantes
- Sistema de carrinho de compras
- Múltiplas formas de pagamento
- Acompanhamento em tempo real do pedido
- Sistema de avaliações e feedback

### 1.2. Arquitetura

- **Frontend**: React 18.2.0 com TypeScript
- **Backend**: Node.js 18 com Express 4.18.2 e TypeScript 5.3.3
- **Banco de Dados**: PostgreSQL 15-alpine
- **ORM**: Prisma 5.7.0
- **Containerização**: Docker Desktop v28.0.1 com Docker Compose
- **Documentação API**: Swagger/OpenAPI 3.0

---

## 2. Estrutura do Projeto

```
PedeAki/
├── Backend/
│   ├── prisma/
│   │   └── schema.prisma              # Schema do banco de dados
│   ├── scripts/
│   │   ├── seed-categorias.js          # Seed de categorias
│   │   ├── seed-restaurantes.js       # Seed de restaurantes
│   │   ├── seed-produtos.js            # Seed de produtos
│   │   ├── seed-clientes.js            # Seed de usuários
│   │   ├── seed-pedidos-avaliacoes.js  # Seed de pedidos e avaliações
│   │   ├── seed-from-json.js           # Seed a partir de JSON
│   │   └── seed-all.js                 # Seed completo
│   ├── data/
│   │   └── seed-data.json              # Dados de seed em JSON
│   ├── src/
│   │   ├── config/
│   │   │   ├── multer.ts               # Configuração de upload de arquivos
│   │   │   ├── passport.ts             # Configuração de autenticação OAuth
│   │   │   └── swagger.ts               # Configuração do Swagger
│   │   ├── controllers/                # Camada de controle (HTTP)
│   │   │   ├── auth/
│   │   │   │   └── LoginComCodigoController.ts
│   │   │   ├── avaliacao/
│   │   │   │   └── AvaliacaoController.ts
│   │   │   ├── carrinho/
│   │   │   │   └── CarrinhoController.ts
│   │   │   ├── categoria/
│   │   │   │   ├── CategoriaController.ts
│   │   │   │   ├── CreateCategoriaController.ts
│   │   │   │   ├── DeleteCategoriaController.ts
│   │   │   │   ├── ReadCategoriaController.ts
│   │   │   │   └── UpdateCategoriaController.ts
│   │   │   ├── cupom/
│   │   │   │   └── CupomController.ts
│   │   │   ├── endereco/
│   │   │   │   ├── DeleteEnderecoController.ts
│   │   │   │   ├── EnderecoController.ts
│   │   │   │   ├── ReadEnderecoByIdController.ts
│   │   │   │   ├── ReadEnderecoController.ts
│   │   │   │   └── UpdateEnderecoController.ts
│   │   │   ├── pagamento/
│   │   │   │   ├── CartaoController.ts
│   │   │   │   └── PagamentoController.ts
│   │   │   ├── pedido/
│   │   │   │   ├── AcompanhamentoPedidoController.ts
│   │   │   │   ├── CreatePedidoController.ts
│   │   │   │   └── NotaFiscalController.ts
│   │   │   ├── produto/
│   │   │   │   ├── CreateProdutosController.ts
│   │   │   │   ├── DeleteProdutoController.ts
│   │   │   │   ├── GetCardapioController.ts
│   │   │   │   ├── GetProdutosByCategoriaController.ts
│   │   │   │   ├── GetProdutosByRestauranteController.ts
│   │   │   │   ├── ProdutoController.ts
│   │   │   │   ├── ReadProdutoController.ts
│   │   │   │   └── UpdateProdutoController.ts
│   │   │   ├── restaurante/
│   │   │   │   ├── CreateRestauranteController.ts
│   │   │   │   ├── DeleteRestauranteController.ts
│   │   │   │   ├── GetRestaurantesByEnderecoController.ts
│   │   │   │   ├── ListRestaurantesController.ts
│   │   │   │   ├── ReadRestauranteController.ts
│   │   │   │   ├── RestauranteController.ts
│   │   │   │   └── UpdateRestauranteController.ts
│   │   │   └── usuario/
│   │   │       ├── AuthUsuarioController.ts
│   │   │       ├── CreateUsuarioController.ts
│   │   │       ├── DeleteUsuarioController.ts
│   │   │       ├── RecuperarSenhaController.ts
│   │   │       ├── SocialAuthController.ts
│   │   │       ├── UpdateUsuarioController.ts
│   │   │       └── UsuarioController.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts       # Middleware de autenticação JWT
│   │   ├── services/                   # Camada de lógica de negócio
│   │   │   ├── auth/
│   │   │   │   ├── CodigoVerificacaoService.ts
│   │   │   │   └── EnvioCodigoService.ts
│   │   │   ├── avaliacao/
│   │   │   │   └── AvaliacaoService.ts
│   │   │   ├── carrinho/
│   │   │   │   └── CarrinhoService.ts
│   │   │   ├── categoria/
│   │   │   │   ├── CategoriaService.ts
│   │   │   │   ├── CreateCategoriaService.ts
│   │   │   │   ├── DeleteCategoriaService.ts
│   │   │   │   ├── ReadCategoriaService.ts
│   │   │   │   └── UpdateCategoriaService.ts
│   │   │   ├── cupom/
│   │   │   │   └── CupomService.ts
│   │   │   ├── endereco/
│   │   │   │   ├── DeleteEnderecoService.ts
│   │   │   │   ├── EnderecoService.ts
│   │   │   │   ├── ReadEnderecoByIdService.ts
│   │   │   │   ├── ReadEnderecoService.ts
│   │   │   │   └── UpdateEnderecoService.ts
│   │   │   ├── pagamento/
│   │   │   │   ├── CartaoService.ts
│   │   │   │   └── PagamentoService.ts
│   │   │   ├── pedido/
│   │   │   │   ├── AcompanhamentoPedidoService.ts
│   │   │   │   ├── CreatePedidoService.ts
│   │   │   │   └── NotaFiscalService.ts
│   │   │   ├── produto/
│   │   │   │   ├── CreateProdutosService.ts
│   │   │   │   ├── DeleteProdutoService.ts
│   │   │   │   ├── GetCardapioService.ts
│   │   │   │   ├── GetProdutosByCategoriaService.ts
│   │   │   │   ├── GetProdutosByRestauranteService.ts
│   │   │   │   ├── ProdutoService.ts
│   │   │   │   ├── ReadProdutoService.ts
│   │   │   │   └── UpdateProdutoService.ts
│   │   │   ├── restaurante/
│   │   │   │   ├── CreateRestauranteService.ts
│   │   │   │   ├── DeleteRestauranteService.ts
│   │   │   │   ├── GetRestaurantesByEnderecoService.ts
│   │   │   │   ├── ListRestaurantesService.ts
│   │   │   │   ├── ReadRestauranteService.ts
│   │   │   │   ├── RestauranteService.ts
│   │   │   │   └── UpdateRestauranteService.ts
│   │   │   └── usuario/
│   │   │       ├── AuthUsuarioService.ts
│   │   │       ├── CreateUsuarioService.ts
│   │   │       ├── DeleteUsuarioService.ts
│   │   │       ├── LoginComCodigoService.ts
│   │   │       ├── RecuperarSenhaService.ts
│   │   │       ├── SocialAuthService.ts
│   │   │       ├── UpdateUsuarioService.ts
│   │   │       └── UsuarioService.ts
│   │   ├── utils/
│   │   │   ├── calculations.ts         # Funções de cálculo (distância, etc.)
│   │   │   └── validators.ts          # Funções de validação
│   │   ├── router.ts                   # Definição de todas as rotas
│   │   └── server.ts                   # Configuração do servidor Express
│   ├── tmp/                            # Diretório temporário para uploads
│   ├── Dockerfile                      # Configuração Docker do backend
│   ├── package.json                    # Dependências do projeto
│   ├── tsconfig.json                   # Configuração TypeScript
│   ├── MODELO_DADOS_FISICO_COMPLETO.md # Documentação do modelo de dados
│   ├── SCRIPT_SQL_COMPLETO.sql        # Script SQL completo
│   └── DOCUMENTACAO_TECNICA_COMPLETA.md # Este arquivo
├── Frontend/
│   ├── src/
│   │   ├── App.tsx                     # Componente principal
│   │   └── ...                         # Componentes React
│   ├── Dockerfile                      # Configuração Docker do frontend
│   └── package.json                    # Dependências do frontend
└── docker-compose.yml                  # Orquestração dos containers
```

---

## 3. Endpoints da API

### 3.1. Autenticação e Usuários

#### 3.1.1. Cadastro e Login

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/users` | Não | Criar novo usuário |
| POST | `/login` | Não | Autenticar usuário com email e senha |
| POST | `/auth/solicitar-codigo` | Não | Solicitar código de verificação (email/SMS/WhatsApp) |
| POST | `/auth/validar-codigo` | Não | Validar código de verificação |
| POST | `/auth/recuperar-senha` | Não | Solicitar recuperação de senha |
| POST | `/auth/redefinir-senha` | Não | Redefinir senha com código de verificação |
| POST | `/auth/login/facebook` | Não | Login via Facebook (simulado com email) |
| POST | `/auth/login/google` | Não | Login via Google (simulado com email) |

#### 3.1.2. Gerenciamento de Usuários

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| GET | `/usuarios` | Não | Listar todos os usuários |
| GET | `/usuario/:id` | Não | Buscar usuário por ID |
| PUT | `/usuario/:id` | Não | Atualizar usuário |
| DELETE | `/usuario/:id` | Não | Deletar usuário |

### 3.2. Endereços

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/endereco` | Não | Criar novo endereço |
| GET | `/allEnderecos` | Não | Listar todos os endereços |
| GET | `/endereco/:id` | Não | Buscar endereço por ID |
| PUT | `/endereco/:id` | Não | Atualizar endereço |
| DELETE | `/endereco/:id` | Não | Deletar endereço |

### 3.3. Categorias

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/categoria` | Não | Criar nova categoria |
| GET | `/allCategorias` | Não | Listar todas as categorias |
| GET | `/categoria/:id` | Não | Buscar categoria por ID |
| PUT | `/categoria/:id` | Não | Atualizar categoria |
| DELETE | `/categoria/:id` | Não | Deletar categoria |

### 3.4. Restaurantes

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/restaurante` | Não | Criar novo restaurante |
| GET | `/allRestaurantes` | Não | Listar todos os restaurantes |
| GET | `/restaurante/:id` | Não | Buscar restaurante por ID |
| GET | `/restaurantes/endereco/:enderecoId` | Não | Buscar restaurantes por endereço |
| GET | `/restaurantes` | Não | Listar restaurantes com filtros avançados |
| PUT | `/restaurante/:id` | Não | Atualizar restaurante |
| DELETE | `/restaurante/:id` | Não | Deletar restaurante |

### 3.5. Produtos

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/produto` | Não | Criar novo produto (com upload de imagem) |
| GET | `/allProdutos` | Não | Listar todos os produtos |
| GET | `/produto/:id` | Não | Buscar produto por ID |
| GET | `/produtos/categoria/:categoriaId` | Não | Buscar produtos por categoria |
| GET | `/produtos/restaurante/:restauranteId` | Não | Buscar produtos por restaurante |
| GET | `/cardapio/:restauranteId` | Não | Obter cardápio completo do restaurante |
| PUT | `/produto/:id` | Não | Atualizar produto (com upload de imagem) |
| DELETE | `/produto/:id` | Não | Deletar produto |

### 3.6. Carrinho de Compras

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| GET | `/carrinho` | Sim (JWT) | Obter carrinho do usuário |
| POST | `/carrinho` | Sim (JWT) | Adicionar item ao carrinho |
| PUT | `/carrinho/:itemId` | Sim (JWT) | Atualizar quantidade de um item |
| DELETE | `/carrinho/:itemId` | Sim (JWT) | Remover item do carrinho |
| PUT | `/carrinho/:id` | Sim (JWT) | Atualizar carrinho completo |
| DELETE | `/carrinho/:id` | Sim (JWT) | Esvaziar carrinho |

### 3.7. Pedidos

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/pedidos` | Sim (JWT) | Criar novo pedido a partir do carrinho |
| GET | `/pedidos/:pedidoId` | Sim (JWT) | Obter detalhes de um pedido |
| PUT | `/pedidos/:pedidoId/status` | Sim (JWT) | Atualizar status do pedido |
| POST | `/pedidos/:pedidoId/cancelar` | Sim (JWT) | Cancelar pedido |
| PUT | `/pedidos/:pedidoId/endereco` | Sim (JWT) | Alterar endereço de entrega |
| POST | `/pedidos/:pedidoId/recusar` | Sim (JWT) | Recusar pedido (restaurante) |
| PUT | `/pedidos/:pedidoId/item/:itemId` | Sim (JWT) | Atualizar item do pedido |
| GET | `/pedidos/:pedidoId/nota-fiscal` | Sim (JWT) | Gerar nota fiscal do pedido |
| GET | `/pedidos/:pedidoId/pedir-novamente` | Sim (JWT) | Repetir pedido anterior |

### 3.8. Pagamentos

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/pagamento` | Sim (JWT) | Processar pagamento |
| GET | `/cartoes` | Sim (JWT) | Listar cartões salvos do usuário |
| POST | `/cartoes` | Sim (JWT) | Salvar novo cartão |
| PUT | `/cartoes/:cartaoId/padrao` | Sim (JWT) | Definir cartão como padrão |
| DELETE | `/cartoes/:cartaoId` | Sim (JWT) | Remover cartão salvo |

### 3.9. Cupons

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/cupons/validar` | Sim (JWT) | Validar cupom de desconto |

### 3.10. Avaliações

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/avaliacoes` | Sim (JWT) | Criar avaliação de um pedido |

---

## 4. Tecnologias e Dependências

### 4.1. Backend

#### 4.1.1. Runtime e Framework
- **Node.js**: v18
- **Express**: v4.18.2
- **TypeScript**: v5.3.3

#### 4.1.2. Banco de Dados
- **PostgreSQL**: v15-alpine
- **Prisma**: v5.7.0
- **@prisma/client**: v5.7.0

#### 4.1.3. Autenticação
- **jsonwebtoken**: v9.0.3
- **bcryptjs**: v2.4.3
- **passport**: v0.7.0
- **passport-facebook**: v3.0.0
- **passport-google-oauth20**: v2.0.0

#### 4.1.4. Upload de Arquivos
- **multer**: v1.4.5-lts.1

#### 4.1.5. Documentação API
- **swagger-jsdoc**: v6.2.8
- **swagger-ui-express**: v5.0.0

#### 4.1.6. Comunicação Externa
- **axios**: v1.6.2
- **twilio**: v5.10.7
- **nodemailer**: v7.0.11

#### 4.1.7. Utilitários
- **cors**: v2.8.5
- **express-async-errors**: v3.1.1
- **express-session**: v1.18.2

### 4.2. Frontend

- **React**: v18.2.0
- **React Router DOM**: v6.20.1
- **React Scripts**: v5.0.1
- **TypeScript**: v4.9.5
- **Axios**: v1.6.2

### 4.3. Infraestrutura

- **Docker Desktop**: v28.0.1
- **Docker Compose**: Incluso no Docker Desktop

---

## 5. Variáveis de Ambiente

### 5.1. Backend (.env)

```env
# Banco de Dados
DATABASE_URL="postgresql://pedeaki:pedeaki123@postgres:5432/pedeaki?schema=public"

# Servidor
PORT=3000
NODE_ENV=development

# Autenticação
JWT_SECRET=pedeaki_jwt_secret_key_2024

# OAuth (Opcional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Maps (Opcional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Twilio (Opcional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email (Opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 5.2. Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3000
CHOKIDAR_USEPOLLING=true
```

### 5.3. Docker Compose

As variáveis podem ser definidas no arquivo `docker-compose.yml` ou em um arquivo `.env` na raiz do projeto.

---

## 6. Autenticação

### 6.1. JWT (JSON Web Tokens)

O sistema utiliza JWT para autenticação de usuários. O token é gerado no login e deve ser enviado em todas as requisições protegidas.

#### 6.1.1. Obter Token

**Endpoint**: `POST /login`

**Request Body**:
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response**:
```json
{
  "message": "Login efetuado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@email.com"
  }
}
```

#### 6.1.2. Usar Token

Incluir o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 6.1.3. Validade do Token

- **Duração**: 24 horas
- **Expiração**: Após 24 horas de inatividade, o token expira e é necessário fazer login novamente

### 6.2. Autenticação Social

O sistema suporta autenticação via Facebook e Google através de endpoints simplificados que validam o email contra o banco de dados local.

**Endpoints**:
- `POST /auth/login/facebook`
- `POST /auth/login/google`

**Request Body**:
```json
{
  "email": "usuario@email.com"
}
```

---

## 7. Como Executar o Projeto

### 7.1. Pré-requisitos

- Docker Desktop instalado e rodando
- Node.js 18+ (opcional, para desenvolvimento local)
- Git

### 7.2. Execução com Docker (Recomendado)

1. **Clone o repositório** (se aplicável)

2. **Inicie os containers**:
```bash
docker-compose up -d
```

3. **Aguarde a inicialização**:
   - Backend estará disponível em `http://localhost:3000`
   - Frontend estará disponível em `http://localhost:3001`
   - PostgreSQL estará disponível em `localhost:5432`

4. **Acesse a documentação Swagger**:
   - URL: `http://localhost:3000/api-docs`

### 7.3. Execução Local (Desenvolvimento)

#### 7.3.1. Backend

```bash
cd Backend
npm install
npm run dev
```

#### 7.3.2. Frontend

```bash
cd Frontend
npm install
npm start
```

### 7.4. Seed do Banco de Dados

Para popular o banco de dados com dados iniciais:

```bash
# Via Docker
docker-compose exec backend npm run seed

# Localmente
cd Backend
npm run seed
```

---

## 8. Estrutura de Resposta da API

### 8.1. Resposta de Sucesso

```json
{
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### 8.2. Resposta de Erro

```json
{
  "error": "Mensagem de erro descritiva",
  "message": "Detalhes adicionais do erro"
}
```

### 8.3. Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Erro de validação ou requisição inválida
- **401 Unauthorized**: Token não fornecido ou inválido
- **403 Forbidden**: Acesso negado
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

---

## 9. Upload de Arquivos

O sistema suporta upload de imagens para produtos e restaurantes usando `multipart/form-data`.

### 9.1. Endpoints com Upload

- `POST /produto`
- `PUT /produto/:id`

### 9.2. Formato da Requisição

Usar `multipart/form-data` com o campo `file` para a imagem.

**Exemplo com cURL**:
```bash
curl -X POST http://localhost:3000/produto \
  -H "Content-Type: multipart/form-data" \
  -F "name_produto=Hambúrguer" \
  -F "preco=25.90" \
  -F "id_restaurante=uuid" \
  -F "id_categoria=LANCHES" \
  -F "file=@/caminho/para/imagem.jpg"
```

---

## 10. Documentação Swagger

A documentação completa da API está disponível via Swagger UI:

**URL**: `http://localhost:3000/api-docs`

### 10.1. Funcionalidades do Swagger

- Visualização de todos os endpoints
- Teste direto dos endpoints
- Autenticação via JWT (botão "Authorize")
- Exemplos de requisição e resposta
- Esquemas de dados completos

### 10.2. Como Usar o Swagger

1. Acesse `http://localhost:3000/api-docs`
2. Para testar endpoints protegidos:
   - Faça login via `POST /login`
   - Copie o token retornado
   - Clique em "Authorize" no topo da página
   - Cole o token no campo "Value"
   - Clique em "Authorize" e depois "Close"
3. Agora você pode testar todos os endpoints protegidos

---

## 11. Banco de Dados

### 11.1. Conexão

- **Host**: `localhost` (ou `postgres` dentro do Docker)
- **Porta**: `5432`
- **Database**: `pedeaki`
- **Usuário**: `pedeaki`
- **Senha**: `pedeaki123`

### 11.2. Ferramentas Recomendadas

- **DBeaver**: Para visualização e gerenciamento do banco
- **pgAdmin**: Alternativa ao DBeaver
- **Prisma Studio**: `npx prisma studio` (interface visual do Prisma)

### 11.3. Migrações

O Prisma gerencia as migrações automaticamente. Para aplicar mudanças no schema:

```bash
# Via Docker
docker-compose exec backend npx prisma db push

# Localmente
cd Backend
npx prisma db push
```

---

## 12. Padrões de Código

### 12.1. Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado:

- **Models**: Definidos no Prisma Schema
- **Controllers**: Recebem requisições HTTP e delegam para Services
- **Services**: Contêm a lógica de negócio
- **Middleware**: Interceptam requisições (autenticação, validação)

### 12.2. Convenções de Nomenclatura

- **Controllers**: `[Nome]Controller.ts` (ex: `CreateUsuarioController.ts`)
- **Services**: `[Nome]Service.ts` (ex: `CreateUsuarioService.ts`)
- **Rotas**: kebab-case (ex: `/usuario/:id`)
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

### 12.3. Tratamento de Erros

Todos os erros são capturados e retornados com status HTTP apropriado:

```typescript
try {
  // código
} catch (error) {
  return response.status(400).json({ error: "Mensagem de erro" });
}
```

---

## 13. Segurança

### 13.1. Senhas

- Senhas são criptografadas com **bcryptjs** antes de serem armazenadas
- Hash com salt automático
- Nunca retornar senhas nas respostas da API

### 13.2. Tokens JWT

- Tokens assinados com secret key
- Validade de 24 horas
- Verificação em todas as rotas protegidas

### 13.3. Validação de Dados

- Validação de entrada em todos os endpoints
- Sanitização de dados do usuário
- Validação de tipos e formatos

### 13.4. CORS

Configurado para permitir requisições do frontend em desenvolvimento.

---

## 14. Logs e Debugging

### 14.1. Logs do Backend

Para visualizar os logs do backend:

```bash
docker-compose logs -f backend
```

### 14.2. Logs do Banco de Dados

```bash
docker-compose logs -f postgres
```

### 14.3. Debugging

O backend inclui logs detalhados para:
- Autenticação (tokens, validação)
- Criação de recursos
- Erros e exceções

---

## 15. Testes

### 15.1. Testes Manuais

Use o Swagger UI para testar os endpoints:
- `http://localhost:3000/api-docs`

### 15.2. Testes com cURL

Exemplos de requisições com cURL estão disponíveis na documentação Swagger.

---

## 16. Deploy

### 16.1. Produção

Para produção, considere:
- Variáveis de ambiente seguras
- HTTPS/SSL
- Rate limiting
- Monitoramento e logs
- Backup do banco de dados
- CDN para imagens

### 16.2. Docker Compose para Produção

Ajuste o `docker-compose.yml` para:
- Remover volumes de desenvolvimento
- Configurar variáveis de ambiente de produção
- Habilitar restart automático
- Configurar limites de recursos

---

## 17. Referências

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com/
- **Swagger/OpenAPI**: https://swagger.io/specification/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Docker Docs**: https://docs.docker.com/

---

## 18. Suporte e Contato

Para dúvidas ou problemas:
- Consulte a documentação Swagger: `http://localhost:3000/api-docs`
- Verifique os logs: `docker-compose logs backend`
- Revise a documentação de funcionalidades e regras de negócio

---

**Última atualização**: 2024
