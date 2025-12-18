# Diagnóstico Rápido - PedeAki

## ✅ Containers estão rodando! Agora vamos verificar:

### 1. Verificar logs do Backend (copie e cole no PowerShell):

```powershell
docker-compose logs backend --tail=30
```

**O que procurar:**
- ✅ `🚀 Server online na porta 3000!` = Backend funcionando
- ❌ Se não aparecer essa mensagem, o backend não iniciou corretamente

### 2. Verificar logs do Frontend:

```powershell
docker-compose logs frontend --tail=30
```

**O que procurar:**
- ✅ `Compiled successfully!` = Frontend compilado
- ✅ `webpack compiled` = Frontend pronto
- ❌ Se aparecer erros, anote-os

### 3. Testar Backend no Navegador:

Abra estas URLs no navegador:

1. **Swagger (Documentação):**
   ```
   http://localhost:3000/api-docs
   ```
   - Se abrir = ✅ Backend funcionando

2. **API de Categorias:**
   ```
   http://localhost:3000/allCategorias
   ```
   - Se retornar JSON = ✅ API funcionando
   - Se der erro 404 ou connection refused = ❌ Backend com problema

### 4. Testar Frontend:

Abra no navegador:
```
http://localhost:3001
```

**O que deve acontecer:**
- ✅ Página carrega com header vermelho e logo
- ✅ Mostra "Carregando..." e depois os carrosséis
- ❌ Se ficar em "Carregando..." = Problema de conexão com backend
- ❌ Se der erro na página = Problema no frontend

### 5. Se o Backend não responder:

```powershell
# Reiniciar apenas o backend
docker-compose restart backend

# Aguardar 10 segundos e verificar logs
Start-Sleep -Seconds 10
docker-compose logs backend --tail=20
```

### 6. Se o Frontend não carregar:

```powershell
# Reiniciar apenas o frontend
docker-compose restart frontend

# Aguardar 30 segundos (React demora para compilar)
Start-Sleep -Seconds 30
docker-compose logs frontend --tail=20
```

### 7. Solução Nuclear (se nada funcionar):

```powershell
# Parar tudo
docker-compose down

# Reconstruir e iniciar
docker-compose up -d --build

# Aguardar 2 minutos para tudo compilar
Start-Sleep -Seconds 120

# Verificar status
docker-compose ps
```

### 8. Verificar se as portas estão livres:

```powershell
# Verificar porta 3000 (Backend)
netstat -ano | findstr :3000

# Verificar porta 3001 (Frontend)
netstat -ano | findstr :3001
```

Se aparecer algo, pode haver conflito de porta.

---

## 🎯 Próximos Passos:

1. Execute os comandos acima
2. Me diga o que apareceu nos logs
3. Me diga o que aconteceu ao abrir as URLs no navegador
4. Com essas informações, posso ajudar a resolver o problema específico!

