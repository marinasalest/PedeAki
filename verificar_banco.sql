-- Script para verificar dados no DBeaver
-- Execute este script no DBeaver conectado ao banco pedeaki

-- 1. Verificar se está no banco correto
SELECT current_database() as banco_atual, current_schema() as schema_atual;

-- 2. Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. Contar registros em todas as tabelas principais
SELECT 
  'categorias' as tabela, COUNT(*) as total FROM categorias
UNION ALL
SELECT 'enderecos', COUNT(*) FROM enderecos
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'restaurantes', COUNT(*) FROM restaurantes
UNION ALL
SELECT 'produtos', COUNT(*) FROM produtos
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'itens_pedido', COUNT(*) FROM itens_pedido
UNION ALL
SELECT 'pagamentos', COUNT(*) FROM pagamentos
UNION ALL
SELECT 'avaliacoes', COUNT(*) FROM avaliacoes
ORDER BY tabela;

-- 4. Ver exemplos de dados
SELECT '=== CATEGORIAS ===' as secao;
SELECT id, name FROM categorias LIMIT 5;

SELECT '=== USUARIOS ===' as secao;
SELECT id, name, email FROM usuarios LIMIT 5;

SELECT '=== RESTAURANTES ===' as secao;
SELECT id, name, email FROM restaurantes LIMIT 5;

SELECT '=== PRODUTOS ===' as secao;
SELECT id, name_produto, preco FROM produtos LIMIT 5;

SELECT '=== ENDERECOS ===' as secao;
SELECT id, rua, numero, bairro, cidade FROM enderecos LIMIT 5;

