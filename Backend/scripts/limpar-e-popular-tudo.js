const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const prisma = new PrismaClient();

async function limparBanco() {
  console.log('🧹 Limpando banco de dados...\n');
  
  try {
    // Remove em ordem para respeitar foreign keys
    await prisma.avaliacoes.deleteMany();
    await prisma.pagamentos.deleteMany();
    await prisma.itensPedido.deleteMany();
    await prisma.historicoStatus.deleteMany();
    await prisma.pedidos.deleteMany();
    await prisma.opcoesProduto.deleteMany();
    await prisma.produtos.deleteMany();
    await prisma.usoCupons.deleteMany();
    await prisma.cupons.deleteMany();
    await prisma.carrinho.deleteMany();
    await prisma.cartoesSalvos.deleteMany();
    await prisma.codigosVerificacao.deleteMany();
    await prisma.usuarios.deleteMany();
    await prisma.restaurantes.deleteMany();
    await prisma.enderecos.deleteMany();
    await prisma.categorias.deleteMany();
    
    console.log('✅ Banco limpo com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error.message);
    throw error;
  }
}

async function popularTudo() {
  console.log('🌱 Iniciando população completa do banco...\n');
  
  try {
    // 1. Categorias
    console.log('📦 1/5 - Populando categorias...');
    execSync('node scripts/seed-from-json.js', { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env
    });
    
    // 2. Produtos
    console.log('\n📦 2/5 - Populando produtos...');
    execSync('node scripts/seed-produtos.js', { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env
    });
    
    // 3. Pedidos, avaliações e pagamentos
    console.log('\n📦 3/5 - Populando pedidos, avaliações e pagamentos...');
    execSync('node scripts/seed-pedidos-avaliacoes.js', { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env
    });
    
    console.log('\n✅ População completa concluída!');
    
    // Verifica dados
    console.log('\n🔍 Verificando dados populados...');
    execSync('node scripts/verificar-dados.js', { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env
    });
    
  } catch (error) {
    console.error('\n❌ Erro ao popular banco:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
    
    await limparBanco();
    await popularTudo();
    
    await prisma.$disconnect();
    console.log('\n✅ Processo concluído com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro crítico:', error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

main();

