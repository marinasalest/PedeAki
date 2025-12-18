const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Regiões de SP
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
  { bairro: 'Santo André', cidade: 'Santo André', cep: '09000-000', lat: -23.6667, lng: -46.5333 },
  { bairro: 'São Bernardo', cidade: 'São Bernardo do Campo', cep: '09700-000', lat: -23.6939, lng: -46.5650 },
  { bairro: 'Osasco', cidade: 'Osasco', cep: '06000-000', lat: -23.5329, lng: -46.7915 },
  { bairro: 'Guarulhos', cidade: 'Guarulhos', cep: '07000-000', lat: -23.4538, lng: -46.5331 },
  { bairro: 'Barueri', cidade: 'Barueri', cep: '06400-000', lat: -23.5108, lng: -46.8761 },
  { bairro: 'São Caetano', cidade: 'São Caetano do Sul', cep: '09500-000', lat: -23.6231, lng: -46.5512 },
  { bairro: 'Diadema', cidade: 'Diadema', cep: '09900-000', lat: -23.6864, lng: -46.6228 },
  { bairro: 'Mauá', cidade: 'Mauá', cep: '09300-000', lat: -23.6677, lng: -46.4613 },
  { bairro: 'Ribeirão Pires', cidade: 'Ribeirão Pires', cep: '09400-000', lat: -23.7106, lng: -46.4128 },
  { bairro: 'Cotia', cidade: 'Cotia', cep: '06700-000', lat: -23.6022, lng: -46.9194 },
  { bairro: 'Carapicuíba', cidade: 'Carapicuíba', cep: '06300-000', lat: -23.5235, lng: -46.8406 },
];

const nomes = [
  'Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena',
  'Igor', 'Juliana', 'Lucas', 'Mariana', 'Nicolas', 'Patricia', 'Rafael', 'Sandra',
  'Thiago', 'Vanessa', 'Wagner', 'Yasmin', 'André', 'Beatriz', 'Caio', 'Débora',
  'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Karina', 'Leonardo', 'Larissa',
  'Marcos', 'Natália', 'Otávio', 'Paula', 'Ricardo', 'Sabrina', 'Tatiana', 'Vitor',
  'Amanda', 'Bernardo', 'Camila', 'Diego', 'Elisa', 'Fabio', 'Gisele', 'Hugo'
];

const sobrenomes = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Ribeiro', 'Carvalho', 'Almeida', 'Martins', 'Lopes', 'Araújo',
  'Fernandes', 'Costa', 'Rocha', 'Dias', 'Nascimento', 'Moreira', 'Azevedo', 'Correia',
  'Mendes', 'Nunes', 'Cardoso', 'Teixeira', 'Moura', 'Freitas', 'Barros', 'Cunha'
];

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

function gerarDataNascimento() {
  const hoje = new Date();
  const idade = Math.floor(Math.random() * 47) + 18;
  const ano = hoje.getFullYear() - idade;
  const mes = Math.floor(Math.random() * 12);
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes, dia);
}

function gerarEmail(nome, sobrenome) {
  const dominio = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'];
  const random = Math.floor(Math.random() * 1000);
  return `${nome.toLowerCase()}.${sobrenome.toLowerCase()}${random}@${dominio[Math.floor(Math.random() * dominio.length)]}`;
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');
  console.log('📡 Conectando ao banco de dados...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    throw error;
  }

  const usuariosCriados = [];
  const enderecosCriados = [];
  const senhaHash = await bcrypt.hash('senha123', 8);

  for (let i = 0; i < 50; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const nomeCompleto = `${nome} ${sobrenome}`;
    const email = gerarEmail(nome, sobrenome);
    const cpf = gerarCPF();
    const dataNascimento = gerarDataNascimento();
    const regiao = regioesSP[Math.floor(Math.random() * regioesSP.length)];

    const ruas = [
      'Rua das Flores', 'Avenida Paulista', 'Rua Augusta', 'Avenida Faria Lima',
      'Rua Oscar Freire', 'Avenida Brigadeiro', 'Rua Haddock Lobo', 'Avenida Rebouças',
      'Rua Bela Cintra', 'Avenida Consolação', 'Rua dos Três Irmãos', 'Avenida Angélica',
      'Rua Pamplona', 'Avenida Nove de Julho', 'Rua Estados Unidos', 'Avenida Ibirapuera',
      'Rua Vergueiro', 'Avenida do Estado', 'Rua da Consolação', 'Avenida São João'
    ];

    const rua = ruas[Math.floor(Math.random() * ruas.length)];
    const numero = Math.floor(Math.random() * 5000) + 1;
    const complementos = ['Apto 101', 'Apto 202', 'Casa', 'Sobrado', 'Apto 301', 'Apto 45', '', 'Bloco A', 'Bloco B'];
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

      enderecosCriados.push(endereco);

      const usuario = await prisma.usuarios.create({
        data: {
          name: nomeCompleto,
          cpf,
          data_nascimento: dataNascimento,
          email,
          password: senhaHash,
          provider: 'local',
          id_endereco: endereco.id,
          saldo_carteira: Math.random() * 500
        }
      });

      usuariosCriados.push(usuario);
      console.log(`✅ Cliente ${i + 1}/50 criado: ${nomeCompleto} - ${regiao.bairro}, ${regiao.cidade}`);
    } catch (error) {
      console.error(`❌ Erro ao criar cliente ${i + 1}:`, error.message);
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`   - ${enderecosCriados.length} endereços criados`);
  console.log(`   - ${usuariosCriados.length} clientes criados`);
  const cidades = new Set(enderecosCriados.map(e => e.cidade));
  console.log(`   - Regiões: ${cidades.size} cidades diferentes`);
  console.log('\n✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

