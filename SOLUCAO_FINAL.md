# Solução Final - Backend

## Problema Identificado
O container está usando uma imagem antiga com ENTRYPOINT que tenta executar `docker-entrypoint.sh`.

## Solução Aplicada
1. ✅ Removido ENTRYPOINT e CMD do Dockerfile
2. ✅ Comando definido diretamente no docker-compose.yml
3. ✅ Logs detalhados adicionados no start.js

## Execute AGORA:

```powershell
# 1. Parar tudo
docker-compose down

# 2. Remover a imagem antiga do backend
docker rmi pedeaki-backend

# 3. Reconstruir TUDO do zero
docker-compose build --no-cache backend

# 4. Iniciar o backend
docker-compose up -d backend

# 5. Aguardar 15 segundos
Start-Sleep -Seconds 15

# 6. Ver logs COMPLETOS
docker-compose logs backend
```

## O que você DEVE ver nos logs:

```
=== INICIANDO BACKEND ===
/app
[lista de arquivos incluindo start.js]
=== EXECUTANDO START.JS ===
========================================
🔍 DIAGNÓSTICO INICIAL
========================================
Diretório atual: /app
...
```

## Se ainda aparecer "docker-entrypoint.sh not found":

A imagem antiga ainda está sendo usada. Execute:

```powershell
# Forçar remoção de TODAS as imagens do backend
docker rmi -f pedeaki-backend
docker rmi -f $(docker images | grep pedeaki-backend | awk '{print $3}')

# Reconstruir
docker-compose build --no-cache backend
docker-compose up -d backend
```

