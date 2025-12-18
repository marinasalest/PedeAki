const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Regiões de SP com coordenadas
const regioesSP = [
  { bairro: 'Centro', cidade: 'São Paulo', cep: '01000-000', lat: -23.5505, lng: -46.6333 },
  { bairro: 'Vila Madalena', cidade: 'São Paulo', cep: '05433-000', lat: -23.5489, lng: -46.6918 },
  { bairro: 'Pinheiros', cidade: 'São Paulo', cep: '05422-000', lat: -23.5676, lng: -46.6912 },
  { bairro: 'Jardins', cidade: 'São Paulo', cep: '01413-000', lat: -23.5676, lng: -46.6734 },
  { bairro: 'Moema', cidade: 'São Paulo', cep: '04560-000', lat: -23.6045, lng: -46.6694 },
  { bairro: 'Vila Olímpia', cidade: 'São Paulo', cep: '04547-000', lat: -23.5925, lng: -46.6875 },
  { bairro: 'Itaim Bibi', cidade: 'São Paulo', cep: '04530-000', lat: -23.5842, lng: -46.6805 },
  { bairro: 'Brooklin', cidade: 'São Paulo', cep: '04562-000', lat: -23.6105, lng: -46.6864 },
  { bairro: 'Campo Belo', cidade: 'São Paulo', cep: '04605-000', lat: -23.6250, lng: -46.6734 },
  { bairro: 'Vila Mariana', cidade: 'São Paulo', cep: '04110-000', lat: -23.5925, lng: -46.6333 },
  { bairro: 'Tatuapé', cidade: 'São Paulo', cep: '03310-000', lat: -23.5405, lng: -46.5750 },
  { bairro: 'Santana', cidade: 'São Paulo', cep: '02010-000', lat: -23.5000, lng: -46.6333 },
  { bairro: 'Santo André', cidade: 'Santo André', cep: '09000-000', lat: -23.6667, lng: -46.5333 },
  { bairro: 'São Bernardo', cidade: 'São Bernardo do Campo', cep: '09700-000', lat: -23.6939, lng: -46.5650 },
  { bairro: 'Osasco', cidade: 'Osasco', cep: '06000-000', lat: -23.5329, lng: -46.7915 },
  { bairro: 'Guarulhos', cidade: 'Guarulhos', cep: '07000-000', lat: -23.4538, lng: -46.5331 },
  { bairro: 'Barueri', cidade: 'Barueri', cep: '06400-000', lat: -23.5108, lng: -46.8761 },
  { bairro: 'São Caetano', cidade: 'São Caetano do Sul', cep: '09500-000', lat: -23.6231, lng: -46.5512 },
  { bairro: 'Diadema', cidade: 'Diadema', cep: '09900-000', lat: -23.6864, lng: -46.6228 },
  { bairro: 'Mauá', cidade: 'Mauá', cep: '09300-000', lat: -23.6677, lng: -46.4613 },
];

// Nomes de restaurantes por categoria
const nomesRestaurantes = {
  'LANCHES': ['Burger King', 'McDonald\'s', 'Bob\'s', 'Habib\'s', 'Subway', 'Giraffas', 'Outback', 'TGI Fridays'],
  'PIZZA': ['Domino\'s Pizza', 'Pizza Hut', 'Papa John\'s', 'Brotto', 'Famiglia Mancini', 'Bráz', 'Camelo', 'Eataly'],
  'JAPONESA': ['Sushi Yassu', 'Temakeria', 'Sushi Loko', 'Sushi Isao', 'Jojo Ramen', 'Kotobuki', 'Sakura', 'Hinode'],
  'BRASILEIRA': ['Feijoada da Lana', 'Churrascaria Fogo de Chão', 'Cantina da Nonna', 'Bar do Mané', 'Boteco do Alemão', 'Casa da Feijoada', 'Tradição Mineira', 'Sabor Brasileiro'],
  'ARABE': ['Habib\'s', 'Ali Baba', 'Shawarma King', 'Esfiha do Zé', 'Kebab House', 'Aladdin', 'Beirute', 'Sultan'],
  'CHINESA': ['China in Box', 'Jin Jin', 'Lamen Kazu', 'Tasty China', 'Dragon House', 'Panda Express', 'Golden Dragon', 'Oriental Express'],
  'ITALIANA': ['Famiglia Mancini', 'Brotto', 'Eataly', 'La Pasta', 'Bella Italia', 'Trattoria', 'Nonna\'s Kitchen', 'Bella Vista'],
  'MARMITAS': ['Marmitex do Zé', 'PF do João', 'Comida Caseira', 'Marmita Express', 'Sabor do Dia', 'Prato Feito', 'Marmita Top', 'Comida Boa'],
  'SAUDAVEL': ['Green Kitchen', 'Salad Bowl', 'Vida Saudável', 'Fit Food', 'Natural Life', 'Healthy Choice', 'Green Life', 'Veggie House'],
  'ACAI': ['Açaí do Pará', 'Açaí Mania', 'Frooty', 'Açaí Brasil', 'Tropical Açaí', 'Açaí Point', 'Açaí Express', 'Açaí House'],
  'SORVETES': ['Baskin-Robbins', 'Häagen-Dazs', 'Ben & Jerry\'s', 'Sorveteria do Bairro', 'Gelato Artesanal', 'Ice Cream Shop', 'Sorvete Mania', 'Frozen Delight'],
  'CAFETERIA': ['Starbucks', 'Café do Ponto', 'Café Cultura', 'Padaria do Bairro', 'Café Central', 'Bread & Co', 'Café Mania', 'Coffee House'],
  'BEBIDAS': ['Suco Natural', 'Vitaminas & Cia', 'Smoothie Bar', 'Juice Bar', 'Suco Fresco', 'Bebidas Geladas', 'Drink House', 'Refresco Point'],
  'VEGETARIANA': ['Veggie House', 'Green Life', 'Vida Verde', 'Plant Based', 'Veggie Express', 'Natural Food', 'Vegetariano', 'Green Garden'],
  'DOCES': ['Confeitaria do Bairro', 'Doces & Cia', 'Sweet Dreams', 'Candy Shop', 'Doceria Artesanal', 'Sweet House', 'Confeitaria Central', 'Dulce Vida']
};

// Gera CNPJ fake
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

// Gera telefone
function gerarTelefone() {
  const ddd = ['11', '12', '13', '14', '15', '16', '17', '18', '19'];
  const num1 = Math.floor(Math.random() * 9000) + 1000;
  const num2 = Math.floor(Math.random() * 9000) + 1000;
  return `(${ddd[Math.floor(Math.random() * ddd.length)]}) ${num1}-${num2}`;
}

// Gera email do restaurante
function gerarEmailRestaurante(nome) {
  const dominio = ['gmail.com', 'hotmail.com', 'outlook.com'];
  const nomeLimpo = nome.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${nomeLimpo}@${dominio[Math.floor(Math.random() * dominio.length)]}`;
}

// Gera logo fake (usando placeholder.com)
function gerarLogo(nome, categoria) {
  const cores = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  // Usando placeholder.com com texto
  const texto = encodeURIComponent(nome.substring(0, 2).toUpperCase());
  return `https://via.placeholder.com/300x300/${cor}/FFFFFF?text=${texto}`;
}

// Gera horário de funcionamento
function gerarHorario() {
  const abertura = Math.floor(Math.random() * 3) + 8; // 8h a 10h
  const fechamento = Math.floor(Math.random() * 4) + 20; // 20h a 23h
  return {
    abertura: `${abertura.toString().padStart(2, '0')}:00`,
    fechamento: `${fechamento.toString().padStart(2, '0')}:00`
  };
}

// Gera dias de funcionamento
function gerarDiasFuncionamento() {
  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  // Alguns restaurantes fecham domingo, outros não
  if (Math.random() > 0.3) {
    return dias.join(',');
  } else {
    return dias.slice(0, 6).join(',');
  }
}

async function main() {
  console.log('🌱 Iniciando seed de restaurantes...\n');
  console.log('📡 Conectando ao banco de dados...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    throw error;
  }

  // Busca todas as categorias
  const categorias = await prisma.categorias.findMany();
  
  if (categorias.length === 0) {
    console.error('❌ Nenhuma categoria encontrada! Execute primeiro: npm run seed:categorias');
    process.exit(1);
  }

  console.log(`📋 Encontradas ${categorias.length} categorias\n`);

  const restaurantesCriados = [];
  const enderecosCriados = [];
  const senhaHash = await bcrypt.hash('restaurante123', 8);

  for (const categoria of categorias) {
    const nomesDisponiveis = nomesRestaurantes[categoria.id] || ['Restaurante ' + categoria.name];
    const nomesUsados = new Set();

    console.log(`\n🍽️  Criando restaurantes para: ${categoria.name}`);

    for (let i = 0; i < 4; i++) {
      // Seleciona nome único
      let nome;
      do {
        nome = nomesDisponiveis[Math.floor(Math.random() * nomesDisponiveis.length)];
      } while (nomesUsados.has(nome) && nomesUsados.size < nomesDisponiveis.length);
      nomesUsados.add(nome);

      // Seleciona região aleatória
      const regiao = regioesSP[Math.floor(Math.random() * regioesSP.length)];

      // Gera endereço
      const ruas = [
        'Avenida Paulista', 'Rua Augusta', 'Avenida Faria Lima', 'Rua Oscar Freire',
        'Avenida Brigadeiro', 'Rua Haddock Lobo', 'Avenida Rebouças', 'Rua Bela Cintra',
        'Avenida Consolação', 'Rua dos Três Irmãos', 'Avenida Angélica', 'Rua Pamplona',
        'Avenida Nove de Julho', 'Rua Estados Unidos', 'Avenida Ibirapuera', 'Rua Vergueiro'
      ];

      const rua = ruas[Math.floor(Math.random() * ruas.length)];
      const numero = Math.floor(Math.random() * 5000) + 1;
      const complementos = ['Loja 1', 'Loja 2', 'Sobrado', 'Térreo', 'Loja A', 'Loja B', '', 'Shopping'];
      const complemento = complementos[Math.floor(Math.random() * complementos.length)];

      const horario = gerarHorario();
      const diasFuncionamento = gerarDiasFuncionamento();

      try {
        // Cria endereço
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

        enderecosCriados.push(endereco);

        // Cria restaurante
        const restaurante = await prisma.restaurantes.create({
          data: {
            name: nome,
            cnpj: gerarCNPJ(),
            nome_fantasia: nome,
            senha: senhaHash,
            telefone: gerarTelefone(),
            email: gerarEmailRestaurante(nome),
            avaliacao: Math.random() * 2 + 3, // 3.0 a 5.0
            foto: gerarLogo(nome, categoria.id),
            taxa_entrega: Math.random() * 10, // 0 a 10 reais
            tempo_medio_preparo: Math.floor(Math.random() * 30) + 20, // 20 a 50 min
            tempo_medio_entrega: Math.floor(Math.random() * 20) + 15, // 15 a 35 min
            valor_minimo_pedido: Math.random() * 30, // 0 a 30 reais
            entrega_gratis: Math.random() > 0.7, // 30% chance
            valor_minimo_entrega_gratis: Math.random() > 0.7 ? Math.random() * 50 + 30 : null,
            tipo_entrega: Math.random() > 0.5 ? 'propria' : 'terceiros',
            aberto: Math.random() > 0.2, // 80% abertos
            horario_abertura: horario.abertura,
            horario_fechamento: horario.fechamento,
            dias_funcionamento: diasFuncionamento,
            raio_entrega: Math.random() * 10 + 5, // 5 a 15 km
            ceps_atendidos: null, // Pode ser preenchido depois
            ativo: true,
            id_endereco: endereco.id
          }
        });

        restaurantesCriados.push(restaurante);
        console.log(`   ✅ ${i + 1}/4 - ${nome} (${regiao.bairro}, ${regiao.cidade})`);
      } catch (error) {
        console.error(`   ❌ Erro ao criar restaurante "${nome}":`, error.message);
      }
    }
  }

  console.log('\n\n📊 Resumo:');
  console.log(`   - ${enderecosCriados.length} endereços criados`);
  console.log(`   - ${restaurantesCriados.length} restaurantes criados`);
  const cidades = new Set(enderecosCriados.map(e => e.cidade));
  console.log(`   - Regiões: ${cidades.size} cidades diferentes`);
  console.log(`   - Categorias: ${categorias.length} categorias`);
  console.log('\n✅ Seed de restaurantes concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });















