# Verificar e Iniciar os Serviços

## Problema: ERR_CONNECTION_REFUSED

O frontend não consegue se conectar ao backend. Isso significa que o backend não está rodando ou não está acessível.

## Solução Rápida

### 1. Verificar se os containers estão rodando

Abra o PowerShell e execute:

```powershell
docker-compose ps
```

### 2. Se os containers não estiverem rodando, inicie-os:

```powershell
docker-compose up -d
```

### 3. Aguarde alguns segundos e verifique os logs:

```powershell
docker-compose logs backend
```

Você deve ver uma mensagem como:
```
🚀 Server online na porta 3000!
```

### 4. Verifique se o backend está acessível:

Abra no navegador: `http://localhost:3000/api-docs`

Se abrir a documentação Swagger, o backend está funcionando.

### 5. Se ainda não funcionar, reinicie todos os serviços:

```powershell
docker-compose down
docker-compose up -d --build
```

### 6. Verifique se as portas estão corretas:

- Backend deve estar na porta: **3000**
- Frontend deve estar na porta: **3001**

### 7. Teste manualmente a API:

Abra no navegador: `http://localhost:3000/allCategorias`

Se retornar JSON com categorias, o backend está funcionando corretamente.

## Se o problema persistir:

1. Verifique se o Docker Desktop está rodando
2. Verifique se as portas 3000 e 3001 não estão sendo usadas por outros programas
3. Reinicie o Docker Desktop
4. Execute: `docker-compose down -v` (remove volumes também) e depois `docker-compose up -d --build`

