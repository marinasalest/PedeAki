# Comandos Finais - Execute na Ordem

## ⚠️ IMPORTANTE: Execute TODOS os comandos abaixo na ordem:

```powershell
# 1. Parar e remover TUDO
docker-compose down

# 2. Remover a imagem antiga do backend (FORÇA)
docker rmi -f pedeaki-backend

# 3. Limpar cache do Docker (opcional mas recomendado)
docker builder prune -f

# 4. Reconstruir o backend SEM CACHE
docker-compose build --no-cache backend

# 5. Iniciar o backend
docker-compose up -d backend

# 6. Aguardar 20 segundos
Start-Sleep -Seconds 20

# 7. Ver TODOS os logs
docker-compose logs backend
```

## ✅ O que você DEVE ver:

1. **Primeiro, no comando do docker-compose:**
   ```
   === INICIANDO BACKEND ===
   /app
   [lista de arquivos]
   === EXECUTANDO START.JS ===
   ```

2. **Depois, do start.js:**
   ```
   ========================================
   🔍 DIAGNÓSTICO INICIAL
   ========================================
   Diretório atual: /app
   Arquivos encontrados: ...
   start.js existe? true
   ...
   ```

3. **Por fim:**
   ```
   🚀 Server online na porta 3000!
   ```

## ❌ Se ainda aparecer "docker-entrypoint.sh not found":

A imagem antiga ainda está em cache. Execute:

```powershell
# Remover TODAS as imagens relacionadas
docker images | Select-String "pedeaki" | ForEach-Object { $_.Line -split '\s+' | Select-Object -Last 1 } | ForEach-Object { docker rmi -f $_ }

# Reconstruir
docker-compose build --no-cache backend
docker-compose up -d backend
```

