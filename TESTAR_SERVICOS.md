# Testar Serviços - Passo a Passo

## 1. Verificar se os containers estão rodando:

```powershell
docker-compose ps
```

Todos devem estar com status "Up" ou "Running".

## 2. Verificar logs do Backend:

```powershell
docker-compose logs backend --tail=50
```

Procure por: `🚀 Server online na porta 3000!`

## 3. Verificar logs do Frontend:

```powershell
docker-compose logs frontend --tail=50
```

Procure por erros ou mensagens de compilação.

## 4. Testar Backend diretamente:

Abra no navegador:
- `http://localhost:3000/api-docs` (deve abrir Swagger)
- `http://localhost:3000/allCategorias` (deve retornar JSON)

## 5. Testar Frontend:

Abra no navegador:
- `http://localhost:3001` (deve abrir a página inicial)

## 6. Se o backend não responder, reinicie:

```powershell
docker-compose restart backend
docker-compose logs backend -f
```

## 7. Se o frontend não carregar, verifique se compilou:

```powershell
docker-compose logs frontend | Select-String -Pattern "Compiled|error|Error"
```

## 8. Se nada funcionar, reconstrua tudo:

```powershell
docker-compose down
docker-compose up -d --build
```

Aguarde 2-3 minutos e teste novamente.

