# Solução para o Problema do Entrypoint

## Problema
O container está tentando executar `/docker-entrypoint.sh` mas o arquivo não está sendo encontrado.

## Solução Aplicada
Atualizei o Dockerfile para usar `sh -c` que garante que o script seja executado corretamente.

## Próximos Passos

### 1. Reconstruir o backend SEM cache:

```powershell
docker-compose stop backend
docker-compose rm -f backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### 2. Aguardar e verificar logs:

```powershell
Start-Sleep -Seconds 15
docker-compose logs backend --tail=50
```

### 3. O que você deve ver:

- ✅ `🚀 Iniciando aplicação...`
- ✅ `⏳ Aguardando PostgreSQL...`
- ✅ `✅ PostgreSQL está pronto!`
- ✅ `📦 Executando migrações...`
- ✅ `🚀 Server online na porta 3000!`

### 4. Se ainda não funcionar, tente esta alternativa:

Edite o `docker-compose.yml` e remova temporariamente o volume mount do backend para testar:

```yaml
backend:
  # ... outras configurações ...
  volumes:
    # Comente esta linha temporariamente:
    # - ./Backend:/app
    - /app/node_modules
```

Depois execute:
```powershell
docker-compose up -d --build backend
```

### 5. Teste:

- Swagger: http://localhost:3000/api-docs
- API: http://localhost:3000/allCategorias
- Frontend: http://localhost:3001

