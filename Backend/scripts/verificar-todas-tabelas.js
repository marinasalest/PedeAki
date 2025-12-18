const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando TODAS as tabelas do banco...\n');
  
  const stats = {
    categorias: await prisma.categorias.count(),
    enderecos: await prisma.enderecos.count(),
    usuarios: await prisma.usuarios.count(),
    restaurantes: await prisma.restaurantes.count(),
    produtos: await prisma.produtos.count(),
    pedidos: await prisma.pedidos.count(),
    itensPedido: await prisma.itensPedido.count(),
    pagamentos: await prisma.pagamentos.count(),
    avaliacoes: await prisma.avaliacoes.count(),
    cupons: await prisma.cupons.count(),
    usoCupons: await prisma.usoCupons.count(),
    cartoesSalvos: await prisma.cartoesSalvos.count(),
    carrinho: await prisma.carrinho.count(),
    codigosVerificacao: await prisma.codigosVerificacao.count(),
    opcoesProduto: await prisma.opcoesProduto.count(),
    historicoStatus: await prisma.historicoStatus.count()
  };
  
  console.log('📊 Resumo completo das tabelas:\n');
  console.log('Tabelas principais:');
  console.log(`   ✅ Categorias: ${stats.categorias}`);
  console.log(`   ✅ Endereços: ${stats.enderecos}`);
  console.log(`   ✅ Usuários: ${stats.usuarios}`);
  console.log(`   ✅ Restaurantes: ${stats.restaurantes}`);
  console.log(`   ✅ Produtos: ${stats.produtos}`);
  console.log(`   ✅ Pedidos: ${stats.pedidos}`);
  console.log(`   ✅ Itens de Pedido: ${stats.itensPedido}`);
  console.log(`   ✅ Pagamentos: ${stats.pagamentos}`);
  console.log(`   ✅ Avaliações: ${stats.avaliacoes}`);
  
  console.log('\nTabelas auxiliares:');
  console.log(`   ${stats.cupons > 0 ? '✅' : '⚠️ '} Cupons: ${stats.cupons}`);
  console.log(`   ${stats.usoCupons > 0 ? '✅' : '⚠️ '} Uso de Cupons: ${stats.usoCupons}`);
  console.log(`   ${stats.cartoesSalvos > 0 ? '✅' : '⚠️ '} Cartões Salvos: ${stats.cartoesSalvos}`);
  console.log(`   ${stats.carrinho > 0 ? '✅' : '⚠️ '} Carrinho: ${stats.carrinho}`);
  console.log(`   ${stats.codigosVerificacao > 0 ? '✅' : '⚠️ '} Códigos de Verificação: ${stats.codigosVerificacao}`);
  console.log(`   ${stats.opcoesProduto > 0 ? '✅' : '⚠️ '} Opções de Produto: ${stats.opcoesProduto}`);
  console.log(`   ${stats.historicoStatus > 0 ? '✅' : '⚠️ '} Histórico de Status: ${stats.historicoStatus}`);
  
  const totalPrincipal = stats.categorias + stats.enderecos + stats.usuarios + 
                        stats.restaurantes + stats.produtos + stats.pedidos + 
                        stats.itensPedido + stats.pagamentos + stats.avaliacoes;
  
  console.log(`\n📈 Total de registros nas tabelas principais: ${totalPrincipal}`);
  
  if (stats.categorias > 0 && stats.enderecos > 0 && stats.usuarios > 0 && 
      stats.restaurantes > 0 && stats.produtos > 0 && stats.pedidos > 0) {
    console.log('\n✅ Banco está populado com dados principais!');
  } else {
    console.log('\n⚠️  Algumas tabelas principais estão vazias!');
  }
  
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  });

