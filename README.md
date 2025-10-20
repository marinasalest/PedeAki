# PedeAki - Sistema de Delivery de Comida

Sistema completo de delivery de comida desenvolvido com Node.js, TypeScript, Prisma e PostgreSQL.

## Sobre o Projeto

O PedeAki é um sistema completo de delivery de comida que permite aos usuários:
- Cadastrar-se e fazer login
- Buscar restaurantes próximos
- Visualizar cardápios
- Fazer pedidos
- Acompanhar entregas
- Avaliar restaurantes

## CRUD Completo

### Usuários
- Criar usuário
- Listar usuários
- Buscar usuário por ID
- Atualizar usuário
- Deletar usuário
- Login com autenticação

### Endereços
- Criar endereço
- Listar endereços
- Atualizar endereço
- Deletar endereço

### Restaurantes
- Criar restaurante
- Listar restaurantes

### Produtos
- Criar produto com upload de imagem
- Sistema de categorias completo

### Categorias
- Criar categoria
- Listar categorias
- Atualizar categoria
- Deletar categoria

## Banco de Dados

### Modelo de Dados

O sistema utiliza um modelo relacional com as seguintes entidades principais:

- **Usuarios** ↔ **Enderecos** (1:1)
- **Restaurantes** ↔ **Enderecos** (1:1)
- **Restaurantes** ↔ **Produtos** (1:N)
- **Categorias** ↔ **Produtos** (1:N)
- **Usuarios** ↔ **Pedidos** (1:N)
- **Restaurantes** ↔ **Pedidos** (1:N)
- **Produtos** ↔ **Pedidos** (1:N)

### Tabelas Principais

- **usuarios** - Dados dos usuários
- **enderecos** - Endereços dos usuários e restaurantes
- **restaurantes** - Dados dos restaurantes
- **produtos** - Cardápio dos restaurantes
- **categorias** - Categorias de produtos
- **pedidos** - Pedidos realizados
- **avaliacoes** - Avaliações dos restaurantes
- **pagamentos** - Dados de pagamento

## Upload de Arquivos

O sistema está configurado para fazer upload de imagens na pasta `tmp/`. O upload é gerenciado pelo Multer e permite:

- Upload de imagens de produtos
- Validação de tipos de arquivo
- Armazenamento local na pasta `tmp/`
- Integração com o sistema de produtos

## Estrutura do Projeto

```
Backend/
├── src/
│   ├── config/
│   │   ├── multer.ts          # Configuração de upload
│   │   └── swagger.ts         # Configuração do Swagger
│   ├── controllers/           # Controladores da API
│   │   ├── categoria/
│   │   ├── endereco/
│   │   ├── produto/
│   │   ├── restaurante/
│   │   └── usuario/
│   ├── services/              # Lógica de negócio
│   │   ├── categoria/
│   │   ├── endereco/
│   │   ├── produto/
│   │   ├── restaurante/
│   │   └── usuario/
│   ├── prisma/
│   │   └── index.ts           # Cliente Prisma
│   ├── router.ts              # Rotas da API
│   └── server.ts              # Servidor principal
├── prisma/
│   ├── migrations/            # Migrações do banco
│   └── schema.prisma          # Schema do banco
├── tmp/                       # Upload de arquivos
├── package.json
├── tsconfig.json
└── README.md
```

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **bcryptjs** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **Swagger** - Documentação da API

### Ferramentas de Desenvolvimento
- **ts-node-dev** - Desenvolvimento com hot reload
- **CORS** - Cross-origin resource sharing

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/marinasalest/PedeAki.git
cd PedeAki
```

### 2. Instale as dependências

```bash
cd Backend
npm install
```

### 3. Configure o banco de dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE pedeaki;
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `Backend`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pedeaki"
PORT=3000
```

Substitua `usuario` e `senha` pelas suas credenciais do PostgreSQL.

### 5. Execute as migrações do banco

```bash
npm run prisma:migrate
```

### 6. Gere o cliente Prisma

```bash
npm run prisma:generate
```

## Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado na porta 3000 (ou na porta definida na variável PORT).

### Modo Produção

```bash
npm run build
npm start
```

### Prisma Studio (Interface do Banco)

```bash
npm run prisma:studio
```

Acesse `http://localhost:5555` para visualizar e gerenciar os dados do banco.

## Documentação da API

A documentação completa da API está disponível através do Swagger UI:

**URL:** `http://localhost:3000/api-docs`

### Principais Endpoints

#### Usuários
- `POST /users` - Criar usuário
- `POST /login` - Login
- `GET /usuarios` - Listar usuários
- `GET /usuario/:id` - Buscar usuário por ID
- `PUT /usuario/:id` - Atualizar usuário
- `DELETE /usuario/:id` - Deletar usuário

#### Endereços
- `POST /endereco` - Criar endereço
- `GET /allEnderecos` - Listar endereços
- `PUT /endereco/:id` - Atualizar endereço
- `DELETE /endereco/:id` - Deletar endereço

#### Restaurantes
- `POST /restaurante` - Criar restaurante
- `GET /allRestaurantes` - Listar restaurantes

#### Produtos
- `POST /produto` - Criar produto (com upload de imagem)

#### Categorias
- `POST /categoria` - Criar categoria
- `GET /allCategorias` - Listar categorias
- `PUT /categoria/:id` - Atualizar categoria
- `DELETE /categoria/:id` - Deletar categoria

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor em modo desenvolvimento

# Produção
npm run build            # Compila o TypeScript
npm start                # Inicia o servidor compilado

# Banco de Dados
npm run prisma:generate  # Gera o cliente Prisma
npm run prisma:migrate   # Executa migrações
npm run prisma:studio    # Abre o Prisma Studio
```

## Autor

**Marina Sales**
- GitHub: [@marinasalest](https://github.com/marinasalest)

---

**Desenvolvido com ❤️ para a Faculdade Impacta**
