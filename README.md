# 🍕 PedeAki - Sistema de Delivery de Comida

Sistema completo de delivery de comida desenvolvido com Node.js, TypeScript, Prisma e PostgreSQL.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O PedeAki é um sistema completo de delivery de comida que permite aos usuários:
- Cadastrar-se e fazer login
- Buscar restaurantes próximos
- Visualizar cardápios
- Fazer pedidos
- Acompanhar entregas
- Avaliar restaurantes

## ✨ Funcionalidades

### Módulo de Autenticação
- ✅ Cadastro de usuários com validação
- ✅ Login com email e senha
- ✅ Criptografia de senhas com bcrypt
- ✅ Validação de CPF e email únicos
- ✅ Sistema de endereços obrigatório

### Módulo de Solicitação de Pedidos
- ✅ Busca e filtro de restaurantes
- ✅ Visualização de cardápios
- ✅ Sistema de carrinho de compras
- ✅ Cálculo automático de valores
- ✅ Acompanhamento de status do pedido
- ✅ Sistema de avaliações

### CRUD Completo
- ✅ **Usuários**: Criar, listar, buscar, atualizar e deletar
- ✅ **Endereços**: Gerenciamento completo de endereços
- ✅ **Restaurantes**: Cadastro e listagem de restaurantes
- ✅ **Produtos**: Cadastro de produtos com upload de imagens
- ✅ **Categorias**: Gerenciamento de categorias de produtos

## 🛠 Tecnologias Utilizadas

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

## 🏗 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React/Next.js)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Login     │  │ Cadastro    │  │ Dashboard   │            │
│  │   Page      │  │   Page      │  │   Page      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Controllers │  │  Services   │  │  Middleware │            │
│  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Router    │  │   Auth      │  │   Upload    │            │
│  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Prisma ORM
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS (PostgreSQL)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Usuarios  │  │Restaurantes │  │  Produtos   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Pedidos    │  │ Pagamentos  │  │ Avaliacoes  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐                             │
│  │ Enderecos   │  │ Categorias  │                             │
│  └─────────────┘  └─────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- **Git**

## 🚀 Instalação

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

## ⚙️ Configuração

### Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas principais:

- **usuarios** - Dados dos usuários
- **enderecos** - Endereços dos usuários e restaurantes
- **restaurantes** - Dados dos restaurantes
- **produtos** - Cardápio dos restaurantes
- **categorias** - Categorias de produtos
- **pedidos** - Pedidos realizados
- **avaliacoes** - Avaliações dos restaurantes
- **pagamentos** - Dados de pagamento

### Upload de Arquivos

O sistema está configurado para fazer upload de imagens na pasta `tmp/`. Certifique-se de que esta pasta existe e tem permissões de escrita.

## 🏃‍♂️ Executando o Projeto

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

## 📚 Documentação da API

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

## 📁 Estrutura do Projeto

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

## 🗄️ Banco de Dados

### Modelo de Dados

O sistema utiliza um modelo relacional com as seguintes entidades principais:

- **Usuarios** ↔ **Enderecos** (1:1)
- **Restaurantes** ↔ **Enderecos** (1:1)
- **Restaurantes** ↔ **Produtos** (1:N)
- **Categorias** ↔ **Produtos** (1:N)
- **Usuarios** ↔ **Pedidos** (1:N)
- **Restaurantes** ↔ **Pedidos** (1:N)
- **Produtos** ↔ **Pedidos** (1:N)

### Script SQL

Para criar o banco manualmente, execute o script SQL disponível na documentação do projeto.

## 📜 Scripts Disponíveis

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

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Marina Sales**
- GitHub: [@marinasalest](https://github.com/marinasalest)

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor:

1. Verifique se seguiu todos os passos de instalação
2. Consulte a documentação da API em `/api-docs`
3. Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para a Faculdade Impacta**
