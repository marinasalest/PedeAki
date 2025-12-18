const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarDados() {
  try {
    console.log('🔍 Verificando dados no banco...\n');

    const categorias = await prisma.categorias.count();
    const restaurantes = await prisma.restaurantes.count();
    const produtos = await prisma.produtos.count();
    const usuarios = await prisma.usuarios.count();
    const enderecos = await prisma.enderecos.count();
    const pedidos = await prisma.pedidos.count();
    const pagamentos = await prisma.pagamentos.count();
    const avaliacoes = await prisma.avaliacoes.count();

    console.log('📊 Resumo dos dados no banco:\n');
    console.log(`   ✅ Categorias: ${categorias}`);
    console.log(`   ✅ Restaurantes: ${restaurantes}`);
    console.log(`   ✅ Produtos: ${produtos}`);
    console.log(`   ✅ Usuários: ${usuarios}`);
    console.log(`   ✅ Endereços: ${enderecos}`);
    console.log(`   ✅ Pedidos: ${pedidos}`);
    console.log(`   ✅ Pagamentos: ${pagamentos}`);
    console.log(`   ✅ Avaliações: ${avaliacoes}\n`);

    if (categorias > 0 && restaurantes > 0 && produtos > 0) {
      console.log('✅ Banco está populado com dados do JSON!');
    } else {
      console.log('⚠️  Banco parece estar vazio ou incompleto.');
      console.log('💡 Execute: docker-compose exec backend npm run seed');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarDados();

