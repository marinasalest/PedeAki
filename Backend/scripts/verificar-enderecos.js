const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando endereços no banco...\n');
  
  const totalEnderecos = await prisma.enderecos.count();
  console.log(`📊 Total de endereços: ${totalEnderecos}`);
  
  const enderecos = await prisma.enderecos.findMany({
    take: 5,
    include: {
      usuarios: true,
      restaurantes: true
    }
  });
  
  console.log('\n📋 Exemplo de endereços:');
  enderecos.forEach((end, index) => {
    console.log(`\n${index + 1}. ${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade}`);
    console.log(`   CEP: ${end.cep}`);
    console.log(`   Usuários associados: ${end.usuarios.length}`);
    console.log(`   Restaurantes associados: ${end.restaurantes.length}`);
  });
  
  const totalUsuarios = await prisma.usuarios.count();
  const totalRestaurantes = await prisma.restaurantes.count();
  
  // Verifica se há endereços órfãos (não associados)
  const enderecosOrfaos = await prisma.enderecos.findMany({
    where: {
      AND: [
        { usuarios: { none: {} } },
        { restaurantes: { none: {} } }
      ]
    }
  });
  
  const usuariosComEndereco = await prisma.usuarios.count({
    where: { id_endereco: { not: null } }
  });
  
  const restaurantesComEndereco = await prisma.restaurantes.count();
  
  console.log('\n📊 Resumo:');
  console.log(`   Total de endereços: ${totalEnderecos}`);
  console.log(`   Usuários com endereço: ${usuariosComEndereco}/${totalUsuarios}`);
  console.log(`   Restaurantes com endereço: ${restaurantesComEndereco}/${totalRestaurantes}`);
  console.log(`   Endereços órfãos (não associados): ${enderecosOrfaos.length}`);
  
  if (enderecosOrfaos.length > 0) {
    console.log('\n⚠️  Existem endereços não associados a usuários ou restaurantes!');
  }
  
  if (usuariosComEndereco === totalUsuarios && restaurantesComEndereco === totalRestaurantes) {
    console.log('\n✅ Todos os usuários e restaurantes têm endereço associado!');
  } else {
    console.log('\n⚠️  Alguns registros não têm endereço associado!');
  }
  
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  });

