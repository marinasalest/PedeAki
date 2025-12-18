# Frontend PedeAki - React

Frontend React para demonstrar todas as funcionalidades do sistema PedeAki.

## 🚀 Como Iniciar

### 1. Instalar Dependências
```bash
cd Frontend
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm start
```

O frontend estará disponível em: **http://localhost:3001**

## 📋 Funcionalidades Implementadas

### ✅ CRUD de Usuários
- Criar usuário
- Listar usuários
- Editar usuário
- Deletar usuário
- Visualizar no banco de dados

### ✅ Autenticação
- Login com email e senha
- Login com código de 6 dígitos (Email/SMS/WhatsApp)
- Login com Facebook
- Login com Google

### ✅ Consulta de Restaurantes
- Listar todos os restaurantes
- Filtrar por categoria
- Filtrar por avaliação mínima
- Filtrar por preço máximo
- Filtrar por tempo máximo

### ✅ Consulta de Produtos
- Listar todos os produtos
- Filtrar por restaurante
- Filtrar por categoria

### ✅ Cesta de Compras
- Adicionar produtos
- Atualizar quantidade
- Remover produtos
- Finalizar pedido com:
  - Endereço de entrega
  - Forma de pagamento
  - Tipo de entrega
  - Observações

### ✅ Nota Fiscal
- Visualizar NF completa
- Imprimir NF
- Todos os detalhes do pedido

## 🔧 Configuração

O frontend está configurado para se conectar ao backend em `http://localhost:3000`.

Para alterar, edite o arquivo `src/services/api.ts`:

```typescript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000'
```

## 📝 Estrutura

```
Frontend/
├── src/
│   ├── pages/          # Páginas principais
│   │   ├── UsuariosPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RestaurantesPage.tsx
│   │   ├── ProdutosPage.tsx
│   │   ├── CarrinhoPage.tsx
│   │   ├── PedidosPage.tsx
│   │   └── NotaFiscalPage.tsx
│   ├── context/        # Context API (Autenticação)
│   ├── services/       # Serviços (API)
│   └── App.tsx         # Componente principal
```

## 🎥 Para Gravações

1. Inicie o backend: `cd Backend && npm run dev`
2. Inicie o frontend: `cd Frontend && npm start`
3. Abra o Prisma Studio: `cd Backend && npx prisma studio`
4. Acesse: http://localhost:3001

Tudo pronto para suas gravações! 🎬












