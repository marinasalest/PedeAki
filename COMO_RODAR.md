# 🚀 Como Rodar o Sistema Completo

## 📁 Estrutura do Projeto

```
PedeAki/
├── Backend/          # API Node.js/TypeScript
├── Frontend/         # React/TypeScript  
├── docker-compose.yml  # Configuração Docker
└── README.md
```

---

## ✅ Passo a Passo Completo

### 1️⃣ Abra o PowerShell na pasta PedeAki

```powershell
cd "d:\Documents\pedeaki]\novo\PedeAki"
```

### 2️⃣ Suba tudo com Docker (Backend + Frontend + Banco)

```powershell
docker-compose up -d --build
```

**O que isso faz:**
- ✅ Cria e inicia o banco PostgreSQL
- ✅ Cria e inicia o Backend (porta 3000)
- ✅ Cria e inicia o Frontend (porta 3001)
- ✅ Conecta tudo automaticamente

### 3️⃣ Aguarde alguns segundos (30-60 segundos)

Os containers precisam iniciar e o backend precisa conectar no banco.

### 4️⃣ Verifique se está tudo rodando

```powershell
docker-compose ps
```

Você deve ver 3 serviços:
- ✅ `pedeaki-postgres` - Up
- ✅ `pedeaki-backend` - Up  
- ✅ `pedeaki-frontend` - Up

### 5️⃣ (Opcional) Popular banco com dados de teste

```powershell
docker-compose exec backend npm run seed
```

---

## 🔗 Links para Acessar

Após executar os comandos acima:

- **🌐 Frontend (Site):** http://localhost:3001
- **🔧 Backend API:** http://localhost:3000
- **📊 Swagger (Documentação):** http://localhost:3000/api-docs
- **💾 Prisma Studio (Banco):** Execute `docker-compose exec backend npx prisma studio` e acesse http://localhost:5555

---

## 🛠️ Comandos Úteis

### Ver logs do backend
```powershell
docker-compose logs -f backend
```

### Ver logs do frontend
```powershell
docker-compose logs -f frontend
```

### Parar tudo
```powershell
docker-compose down
```

### Reiniciar tudo
```powershell
docker-compose restart
```

---

## ⚠️ Se o Docker não funcionar

### Opção Manual (3 Terminais)

**Terminal 1 - Banco:**
```powershell
cd "d:\Documents\pedeaki]\novo\PedeAki"
docker-compose up postgres -d
```

**Terminal 2 - Backend:**
```powershell
cd "d:\Documents\pedeaki]\novo\PedeAki\Backend"
npm install
npm run dev
```

**Terminal 3 - Frontend:**
```powershell
cd "d:\Documents\pedeaki]\novo\PedeAki\Frontend"
npm install
npm start
```

---

## 💾 Credenciais do Banco

- **Host:** localhost
- **Porta:** 5432
- **Usuário:** pedeaki
- **Senha:** pedeaki123
- **Database:** pedeaki

---

## ✅ Pronto!

Acesse: **http://localhost:3001** 🎉








