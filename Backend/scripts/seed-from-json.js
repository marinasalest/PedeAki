const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Carrega dados do JSON
const seedDataPath = path.join(__dirname, '..', 'data', 'seed-data.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

// Funções auxiliares
function gerarCPF() {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  const n9 = Math.floor(Math.random() * 9);
  const d1 = Math.floor(Math.random() * 10);
  const d2 = Math.floor(Math.random() * 10);
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
}

function gerarCNPJ() {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/0001-${Math.floor(Math.random() * 90) + 10}`;
}

function gerarTelefone() {
  const ddd = ['11', '12', '13', '14', '15', '16', '17', '18', '19'];
  const num1 = Math.floor(Math.random() * 9000) + 1000;
  const num2 = Math.floor(Math.random() * 9000) + 1000;
  return `(${ddd[Math.floor(Math.random() * ddd.length)]}) ${num1}-${num2}`;
}

function gerarEmail(nome, sobrenome) {
  const dominio = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'];
  const random = Math.floor(Math.random() * 1000);
  return `${nome.toLowerCase()}.${sobrenome.toLowerCase()}${random}@${dominio[Math.floor(Math.random() * dominio.length)]}`;
}

function gerarEmailRestaurante(nome) {
  const dominio = ['gmail.com', 'hotmail.com', 'outlook.com'];
  const nomeLimpo = nome.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${nomeLimpo}@${dominio[Math.floor(Math.random() * dominio.length)]}`;
}

function gerarDataNascimento() {
  const hoje = new Date();
  const idade = Math.floor(Math.random() * 47) + 18;
  const ano = hoje.getFullYear() - idade;
  const mes = Math.floor(Math.random() * 12);
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes, dia);
}

function gerarLogo(nome, categoria) {
  const cores = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  const texto = encodeURIComponent(nome.substring(0, 2).toUpperCase());
  return `https://via.placeholder.com/300x300/${cor}/FFFFFF?text=${texto}`;
}

function gerarHorario() {
  const abertura = Math.floor(Math.random() * 3) + 8;
  const fechamento = Math.floor(Math.random() * 4) + 20;
  return {
    abertura: `${abertura.toString().padStart(2, '0')}:00`,
    fechamento: `${fechamento.toString().padStart(2, '0')}:00`
  };
}

function gerarDiasFuncionamento() {
  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  if (Math.random() > 0.3) {
    return dias.join(',');
  } else {
    return dias.slice(0, 6).join(',');
  }
}

async function verificarSeDadosExistem() {
  const categorias = await prisma.categorias.count();
  const usuarios = await prisma.usuarios.count();
  const restaurantes = await prisma.restaurantes.count();
  
  return {
    categorias: categorias > 0,
    usuarios: usuarios > 0,
    restaurantes: restaurantes > 0,
    temDados: categorias > 0 || usuarios > 0 || restaurantes > 0
  };
}

async function seedCategorias() {
  console.log('📦 Populando categorias...');
  
  const categoriasExistentes = await prisma.categorias.findMany({
    select: { id: true }
  });
  const idsExistentes = new Set(categoriasExistentes.map(c => c.id));
  const categoriasParaCriar = seedData.categorias.filter(c => !idsExistentes.has(c.id));

  if (categoriasParaCriar.length === 0) {
    console.log('   ✅ Categorias já existem');
    return;
  }

  await prisma.categorias.createMany({
    data: categoriasParaCriar,
    skipDuplicates: true
  });
  console.log(`   ✅ ${categoriasParaCriar.length} categorias criadas`);
}

async function seedUsuarios() {
  console.log('👥 Populando usuários...');
  
  const usuariosExistentes = await prisma.usuarios.count();
  if (usuariosExistentes >= seedData.config.quantidadeUsuarios) {
    console.log('   ✅ Usuários já existem');
    return;
  }

  const quantidadeParaCriar = seedData.config.quantidadeUsuarios - usuariosExistentes;
  const senhaHash = await bcrypt.hash(seedData.config.senhaPadraoUsuario, 8);
  const usuariosCriados = [];

  for (let i = 0; i < quantidadeParaCriar; i++) {
    const nome = seedData.nomes[Math.floor(Math.random() * seedData.nomes.length)];
    const sobrenome = seedData.sobrenomes[Math.floor(Math.random() * seedData.sobrenomes.length)];
    const nomeCompleto = `${nome} ${sobrenome}`;
    const email = gerarEmail(nome, sobrenome);
    const regiao = seedData.regioesSP[Math.floor(Math.random() * seedData.regioesSP.length)];

    const ruas = [
      'Rua das Flores', 'Avenida Paulista', 'Rua Augusta', 'Avenida Faria Lima',
      'Rua Oscar Freire', 'Avenida Brigadeiro', 'Rua Haddock Lobo', 'Avenida Rebouças'
    ];

    const rua = ruas[Math.floor(Math.random() * ruas.length)];
    const numero = Math.floor(Math.random() * 5000) + 1;
    const complementos = ['Apto 101', 'Apto 202', 'Casa', 'Sobrado', 'Apto 301', ''];
    const complemento = complementos[Math.floor(Math.random() * complementos.length)];

    try {
      const endereco = await prisma.enderecos.create({
        data: {
          rua,
          numero: numero.toString(),
          complemento,
          bairro: regiao.bairro,
          cidade: regiao.cidade,
          estado: 'SP',
          cep: regiao.cep,
          latitude: regiao.lat + (Math.random() * 0.1 - 0.05),
          longitude: regiao.lng + (Math.random() * 0.1 - 0.05)
        }
      });

      const usuario = await prisma.usuarios.create({
        data: {
          name: nomeCompleto,
          cpf: gerarCPF(),
          data_nascimento: gerarDataNascimento(),
          email,
          password: senhaHash,
          provider: 'local',
          id_endereco: endereco.id,
          saldo_carteira: Math.random() * 500
        }
      });

      usuariosCriados.push(usuario);
    } catch (error) {
      console.error(`   ⚠️  Erro ao criar usuário ${i + 1}:`, error.message);
    }
  }

  console.log(`   ✅ ${usuariosCriados.length} usuários criados`);
}

async function seedRestaurantes() {
  console.log('🍽️  Populando restaurantes...');
  
  const categorias = await prisma.categorias.findMany();
  if (categorias.length === 0) {
    console.log('   ⚠️  Nenhuma categoria encontrada. Execute seed de categorias primeiro.');
    return;
  }

  const restaurantesExistentes = await prisma.restaurantes.count();
  const quantidadeEsperada = categorias.length * seedData.config.quantidadeRestaurantesPorCategoria;
  
  if (restaurantesExistentes >= quantidadeEsperada) {
    console.log('   ✅ Restaurantes já existem');
    return;
  }

  const senhaHash = await bcrypt.hash(seedData.config.senhaPadraoRestaurante, 8);
  const restaurantesCriados = [];

  for (const categoria of categorias) {
    const nomesDisponiveis = seedData.nomesRestaurantes[categoria.id] || [`Restaurante ${categoria.name}`];
    const nomesUsados = new Set();
    const restaurantesCategoria = await prisma.restaurantes.count({
      where: { produtos: { some: { id_categoria: categoria.id } } }
    });

    for (let i = 0; i < seedData.config.quantidadeRestaurantesPorCategoria; i++) {
      if (restaurantesCategoria >= seedData.config.quantidadeRestaurantesPorCategoria) break;

      let nome;
      do {
        nome = nomesDisponiveis[Math.floor(Math.random() * nomesDisponiveis.length)];
      } while (nomesUsados.has(nome) && nomesUsados.size < nomesDisponiveis.length);
      nomesUsados.add(nome);

      const regiao = seedData.regioesSP[Math.floor(Math.random() * seedData.regioesSP.length)];
      const ruas = ['Avenida Paulista', 'Rua Augusta', 'Avenida Faria Lima', 'Rua Oscar Freire'];
      const rua = ruas[Math.floor(Math.random() * ruas.length)];
      const numero = Math.floor(Math.random() * 5000) + 1;
      const horario = gerarHorario();
      const diasFuncionamento = gerarDiasFuncionamento();

      try {
        const endereco = await prisma.enderecos.create({
          data: {
            rua,
            numero: numero.toString(),
            complemento: 'Loja 1',
            bairro: regiao.bairro,
            cidade: regiao.cidade,
            estado: 'SP',
            cep: regiao.cep,
            latitude: regiao.lat + (Math.random() * 0.1 - 0.05),
            longitude: regiao.lng + (Math.random() * 0.1 - 0.05)
          }
        });

        const restaurante = await prisma.restaurantes.create({
          data: {
            name: nome,
            cnpj: gerarCNPJ(),
            nome_fantasia: nome,
            senha: senhaHash,
            telefone: gerarTelefone(),
            email: gerarEmailRestaurante(nome),
            avaliacao: Math.random() * 2 + 3,
            foto: gerarLogo(nome, categoria.id),
            taxa_entrega: Math.random() * 10,
            tempo_medio_preparo: Math.floor(Math.random() * 30) + 20,
            tempo_medio_entrega: Math.floor(Math.random() * 20) + 15,
            valor_minimo_pedido: Math.random() * 30,
            entrega_gratis: Math.random() > 0.7,
            valor_minimo_entrega_gratis: Math.random() > 0.7 ? Math.random() * 50 + 30 : null,
            tipo_entrega: Math.random() > 0.5 ? 'propria' : 'terceiros',
            aberto: Math.random() > 0.2,
            horario_abertura: horario.abertura,
            horario_fechamento: horario.fechamento,
            dias_funcionamento: diasFuncionamento,
            raio_entrega: Math.random() * 10 + 5,
            ativo: true,
            id_endereco: endereco.id
          }
        });

        restaurantesCriados.push(restaurante);
      } catch (error) {
        console.error(`   ⚠️  Erro ao criar restaurante "${nome}":`, error.message);
      }
    }
  }

  console.log(`   ✅ ${restaurantesCriados.length} restaurantes criados`);
}

async function main() {
  console.log('🌱 Iniciando seed a partir do JSON...\n');
  console.log('📡 Conectando ao banco de dados...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    throw error;
  }

  // Verifica se já existem dados
  const dadosExistentes = await verificarSeDadosExistem();
  
  if (dadosExistentes.temDados) {
    console.log('📊 Dados existentes encontrados:');
    console.log(`   - Categorias: ${dadosExistentes.categorias ? '✅' : '❌'}`);
    console.log(`   - Usuários: ${dadosExistentes.usuarios ? '✅' : '❌'}`);
    console.log(`   - Restaurantes: ${dadosExistentes.restaurantes ? '✅' : '❌'}`);
    console.log('\n🔄 Populando apenas dados faltantes...\n');
  } else {
    console.log('📦 Banco vazio. Populando todas as tabelas...\n');
  }

  try {
    await seedCategorias();
    await seedUsuarios();
    await seedRestaurantes();
    
    console.log('\n✅ Seed básico concluído!');
    console.log('💡 Para produtos, pedidos e avaliações, execute:');
    console.log('   node scripts/seed-produtos.js');
    console.log('   node scripts/seed-pedidos-avaliacoes.js');
  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });












