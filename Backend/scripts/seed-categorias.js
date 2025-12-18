const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categorias = [
  { id: 'LANCHES', name: 'Lanches / Hamburgueria' },
  { id: 'PIZZA', name: 'Pizza' },
  { id: 'JAPONESA', name: 'Japonesa / Sushi' },
  { id: 'BRASILEIRA', name: 'Brasileira' },
  { id: 'ARABE', name: 'Árabe / Esfiha / Kebab' },
  { id: 'CHINESA', name: 'Chinesa' },
  { id: 'ITALIANA', name: 'Italiana / Massas' },
  { id: 'MARMITAS', name: 'Marmitas / Pratos Feitos (PF)' },
  { id: 'SAUDAVEL', name: 'Saudável / Fitness / Saladas' },
  { id: 'ACAI', name: 'Açaí / Sobremesas' },
  { id: 'SORVETES', name: 'Sorvetes / Gelatos' },
  { id: 'CAFETERIA', name: 'Cafeteria / Padaria' },
  { id: 'BEBIDAS', name: 'Bebidas / Sucos / Refrigerantes' },
  { id: 'VEGETARIANA', name: 'Vegetariana / Vegana' },
  { id: 'DOCES', name: 'Doces / Confeitaria' }
];

async function main() {
  console.log('🌱 Iniciando seed de categorias...\n');
  console.log('📡 Conectando ao banco de dados...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    throw error;
  }

  // Busca todas as categorias existentes de uma vez (otimização)
  const categoriasExistentes = await prisma.categorias.findMany({
    select: { id: true }
  });
  const idsExistentes = new Set(categoriasExistentes.map(c => c.id));

  // Filtra apenas as categorias que ainda não existem
  const categoriasParaCriar = categorias.filter(c => !idsExistentes.has(c.id));

  if (categoriasParaCriar.length === 0) {
    console.log('✅ Todas as categorias já existem no banco de dados!\n');
    console.log(`📊 Total de categorias: ${categorias.length}`);
    return;
  }

  console.log(`📋 Criando ${categoriasParaCriar.length} nova(s) categoria(s)...\n`);

  // Cria todas as categorias de uma vez usando createMany (muito mais rápido)
  try {
    await prisma.categorias.createMany({
      data: categoriasParaCriar,
      skipDuplicates: true // Ignora duplicatas caso existam
    });

    categoriasParaCriar.forEach(categoria => {
        console.log(`✅ Categoria criada: ${categoria.name} (${categoria.id})`);
    });
    } catch (error) {
    console.error('❌ Erro ao criar categorias:', error.message);
    throw error;
  }

  console.log('\n📊 Resumo:');
  console.log(`   - ${categoriasExistentes.length} categorias já existiam`);
  console.log(`   - ${categoriasParaCriar.length} nova(s) categoria(s) criada(s)`);
  console.log(`   - Total de categorias no banco: ${categorias.length}`);
  console.log('\n✅ Seed de categorias concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



