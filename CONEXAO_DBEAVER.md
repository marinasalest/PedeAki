# Configuração DBeaver - PedeAki

## Credenciais de Conexão

**Tipo de Banco:** PostgreSQL

**Configurações:**
- **Host:** `localhost`
- **Porta:** `5432`
- **Database:** `pedeaki`
- **Schema:** `public` (padrão)
- **Usuário:** `pedeaki`
- **Senha:** `pedeaki123`

## String de Conexão JDBC
```
jdbc:postgresql://localhost:5432/pedeaki
```

## Verificação Rápida

Execute estas queries no DBeaver para verificar os dados:

### 1. Verificar tabelas existentes:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 2. Contar registros nas principais tabelas:
```sql
SELECT 
  'categorias' as tabela, COUNT(*) as total FROM categorias
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'restaurantes', COUNT(*) FROM restaurantes
UNION ALL
SELECT 'produtos', COUNT(*) FROM produtos
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'enderecos', COUNT(*) FROM enderecos;
```

### 3. Ver alguns registros:
```sql
-- Categorias
SELECT * FROM categorias LIMIT 5;

-- Usuários
SELECT id, name, email FROM usuarios LIMIT 5;

-- Restaurantes
SELECT id, name, email FROM restaurantes LIMIT 5;

-- Produtos
SELECT id, name_produto, preco FROM produtos LIMIT 5;
```

## Possíveis Problemas

1. **Não está vendo dados:**
   - Verifique se está conectado ao banco `pedeaki` (não `postgres`)
   - Verifique se está no schema `public`
   - Tente executar: `SET search_path TO public;`

2. **Erro de conexão:**
   - Verifique se o Docker está rodando
   - Verifique se o container `pedeaki-postgres` está ativo
   - Teste a conexão: `docker-compose ps`

3. **Tabelas não aparecem:**
   - Atualize a conexão no DBeaver (botão direito > Refresh)
   - Verifique se está no schema correto

## Status Atual do Banco

- ✅ Categorias: 15
- ✅ Usuários: 50
- ✅ Restaurantes: 60
- ✅ Produtos: 600
- ✅ Pedidos: 150
- ✅ Endereços: 110
- ✅ Pagamentos: 150
- ✅ Avaliações: 119

