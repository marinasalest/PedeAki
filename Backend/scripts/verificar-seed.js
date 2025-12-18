const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando dados inseridos no banco...\n');

  try {
    await prisma.$connect();
    
    const categorias = await prisma.categorias.count();
    const enderecos = await prisma.enderecos.count();
    const usuarios = await prisma.usuarios.count();
    const restaurantes = await prisma.restaurantes.count();
    const produtos = await prisma.produtos.count();
    const pedidos = await prisma.pedidos.count();
    const pagamentos = await prisma.pagamentos.count();
    const avaliacoes = await prisma.avaliacoes.count();

    console.log('📊 Resumo dos dados no banco:');
    console.log(`   ✅ Categorias: ${categorias}`);
    console.log(`   ✅ Endereços: ${enderecos}`);
    console.log(`   ✅ Usuários: ${usuarios}`);
    console.log(`   ✅ Restaurantes: ${restaurantes}`);
    console.log(`   ✅ Produtos: ${produtos}`);
    console.log(`   ✅ Pedidos: ${pedidos}`);
    console.log(`   ✅ Pagamentos: ${pagamentos}`);
    console.log(`   ✅ Avaliações: ${avaliacoes}\n`);

    if (categorias > 0 && usuarios > 0 && restaurantes > 0 && produtos > 0) {
      console.log('🎉 Seed executado com sucesso! Todas as tabelas foram populadas.');
    } else {
      console.log('⚠️  Algumas tabelas ainda estão vazias. Execute: npm run seed');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();












