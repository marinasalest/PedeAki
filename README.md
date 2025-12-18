# Pede Aki - Sistema de Delivery de Comida

Sistema completo de delivery de comida desenvolvido para o mercado brasileiro, conectando clientes a restaurantes com funcionalidades completas de pedidos, pagamentos e acompanhamento em tempo real.

## 📋 Sobre o Projeto

O **Pede Aki** é um aplicativo de delivery que tem como objetivo entrar para o mercado de serviços de entrega de alimentos fastfood no Brasil, trazendo facilidade e comodidade aos clientes.

### Funcionalidades Principais

- ✅ Cadastro e autenticação de usuários (email/senha, Facebook, Google)
- ✅ Busca de restaurantes próximos com filtros avançados
- ✅ Visualização de cardápios completos
- ✅ Sistema de carrinho de compras
- ✅ Múltiplas formas de pagamento (crédito, débito, PIX, dinheiro, carteira)
- ✅ Acompanhamento de pedidos em tempo real
- ✅ Sistema de avaliações e feedback
- ✅ Cupons de desconto
- ✅ Gestão de endereços
- ✅ Upload de imagens de produtos

## 🛠️ Tecnologias

### Backend
- **Node.js** v18
- **Express** v4.18.2
- **TypeScript** v5.3.3
- **Prisma** v5.7.0
- **PostgreSQL** v15-alpine
- **JWT** v9.0.3 (Autenticação)
- **bcryptjs** v2.4.3 (Criptografia)
- **Multer** v1.4.5-lts.1 (Upload)
- **Swagger** v6.2.8 (Documentação)

### Frontend
- **React** v18.2.0
- **TypeScript** v4.9.5
- **React Router DOM** v6.20.1
- **Axios** v1.6.2

### Infraestrutura
- **Docker Desktop** v28.0.1
- **Docker Compose**

## 🚀 Como Executar

### Pré-requisitos
- Docker Desktop instalado e rodando
- Git

### Execução com Docker (Recomendado)

1. **Clone o repositório**:
```bash
git clone https://github.com/marinasalest/PedeAki.git
cd PedeAki
```

2. **Inicie os containers**:
```bash
docker-compose up -d
```

3. **Aguarde a inicialização** (o banco será criado automaticamente)

4. **Acesse**:
   - **API**: http://localhost:3000
   - **Swagger**: http://localhost:3000/api-docs
   - **Frontend**: http://localhost:3001

### Execução Local

#### Backend
```bash
cd Backend
npm install
npm run dev
```

#### Frontend
```bash
cd Frontend
npm install
npm start
```

## 📚 Documentação

Toda a documentação está disponível na pasta `Backend/`:

- **DOCUMENTACAO_TECNICA_COMPLETA.md** - Referência técnica completa
- **DOCUMENTACAO_FUNCIONALIDADES_E_REGRAS.md** - Regras de negócio
- **MODELO_DADOS_FISICO_COMPLETO.md** - Estrutura do banco de dados
- **SCRIPT_SQL_COMPLETO.sql** - Script SQL para criação do banco
- **DIAGRAMA_ARQUITETURA_COMPLETO.md** - Diagrama de arquitetura
- **INDICE_DOCUMENTACAO.md** - Índice de toda a documentação

## 📡 API Endpoints

A documentação completa da API está disponível via Swagger:
**http://localhost:3000/api-docs**

### Principais Endpoints

#### Autenticação
- `POST /users` - Criar usuário
- `POST /login` - Login
- `POST /auth/login/facebook` - Login Facebook
- `POST /auth/login/google` - Login Google

#### Restaurantes
- `GET /allRestaurantes` - Listar restaurantes
- `GET /restaurante/:id` - Buscar restaurante
- `GET /restaurantes/endereco/:enderecoId` - Restaurantes por endereço

#### Produtos
- `GET /cardapio/:restauranteId` - Cardápio completo
- `GET /produtos/restaurante/:restauranteId` - Produtos do restaurante

#### Pedidos
- `POST /pedidos` - Criar pedido
- `GET /pedidos/:pedidoId` - Acompanhar pedido
- `PUT /pedidos/:pedidoId/status` - Atualizar status

#### Carrinho
- `GET /carrinho` - Obter carrinho
- `POST /carrinho` - Adicionar item
- `PUT /carrinho/:id` - Atualizar carrinho

## 🗄️ Banco de Dados

- **PostgreSQL** v15-alpine
- **16 tabelas** principais
- **Prisma ORM** para gerenciamento

### Conexão
- **Host**: localhost (ou `postgres` no Docker)
- **Porta**: 5432
- **Database**: pedeaki
- **Usuário**: pedeaki
- **Senha**: pedeaki123

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação:
- Token válido por **24 horas**
- Enviar no header: `Authorization: Bearer {token}`
- Obter token via `POST /login`

## 📦 Estrutura do Projeto

```
PedeAki/
├── Backend/
│   ├── src/
│   │   ├── controllers/    # Controllers HTTP
│   │   ├── services/       # Lógica de negócio
│   │   ├── middleware/    # Middlewares
│   │   ├── config/        # Configurações
│   │   └── utils/         # Utilitários
│   ├── prisma/
│   │   └── schema.prisma  # Schema do banco
│   └── scripts/           # Scripts de seed
├── Frontend/
│   └── src/               # Código React
└── docker-compose.yml     # Orquestração Docker
```

## 🧪 Testes

Use o Swagger UI para testar os endpoints:
- Acesse: http://localhost:3000/api-docs
- Faça login e copie o token
- Clique em "Authorize" e cole o token
- Teste os endpoints protegidos

## 📝 Scripts Disponíveis

### Backend
```bash
npm run dev              # Desenvolvimento
npm run build            # Build
npm start                # Produção
npm run seed             # Popular banco
npm run prisma:studio    # Interface visual do banco
```

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- JWT para autenticação
- Validação de dados em todos os endpoints
- CORS configurado

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a Faculdade Impacta.

## 👤 Autor

**Marina Sales**
- GitHub: [@marinasalest](https://github.com/marinasalest)

## 🙏 Agradecimentos

Desenvolvido com ❤️ para a Faculdade Impacta

---

**Última atualização**: 2024
