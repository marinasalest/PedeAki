#!/bin/sh
set -e

echo "🚀 Iniciando aplicação..."

# Aguarda o PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL..."
until npx prisma db push --skip-generate > /dev/null 2>&1; do
  echo "   PostgreSQL ainda não está pronto. Aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Executa migrações
echo "📦 Executando migrações..."
npx prisma migrate deploy || npx prisma db push

# Verifica se já existem dados e popula se necessário
echo "🔍 Verificando se o banco já possui dados..."
node -e "
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const prisma = new PrismaClient();

(async () => {
  try {
    const categoriasCount = await prisma.categorias.count();
    if (categoriasCount === 0) {
      console.log('📊 Banco vazio detectado. Populando dados iniciais...');
      execSync('node scripts/seed-from-json.js', { stdio: 'inherit' });
      console.log('📦 Populando produtos...');
      execSync('node scripts/seed-produtos.js', { stdio: 'inherit' });
      console.log('📦 Populando pedidos, avaliações e pagamentos...');
      execSync('node scripts/seed-pedidos-avaliacoes.js', { stdio: 'inherit' });
      console.log('✅ Todos os dados iniciais populados com sucesso!');
    } else {
      console.log('✅ Banco já possui dados. Pulando seed.');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar/popular dados:', error.message);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
})();
"

# Executa o comando principal
exec "$@"












