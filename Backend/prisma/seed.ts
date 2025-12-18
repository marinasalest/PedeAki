import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Regiões de SP com CEPs e coordenadas aproximadas
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

// Nomes e sobrenomes brasileiros
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

// Gera CPF válido (apenas formato, não valida dígitos verificadores)
function gerarCPF(): string {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  const n9 = Math.floor(Math.random() * 9);
  
  // Dígitos verificadores simplificados (não são válidos de verdade, mas têm formato correto)
  const d1 = Math.floor(Math.random() * 10);
  const d2 = Math.floor(Math.random() * 10);
  
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
}

// Gera data de nascimento (18-65 anos)
function gerarDataNascimento(): Date {
  const hoje = new Date();
  const idade = Math.floor(Math.random() * 47) + 18; // 18 a 65 anos
  const ano = hoje.getFullYear() - idade;
  const mes = Math.floor(Math.random() * 12);
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes, dia);
}

// Gera email
function gerarEmail(nome: string, sobrenome: string): string {
  const dominio = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'];
  const random = Math.floor(Math.random() * 1000);
  return `${nome.toLowerCase()}.${sobrenome.toLowerCase()}${random}@${dominio[Math.floor(Math.random() * dominio.length)]}`;
}

// Gera número de telefone
function gerarTelefone(): string {
  const ddd = ['11', '12', '13', '14', '15', '16', '17', '18', '19'];
  const num1 = Math.floor(Math.random() * 9000) + 1000;
  const num2 = Math.floor(Math.random() * 9000) + 1000;
  return `(${ddd[Math.floor(Math.random() * ddd.length)]}) 9${num1}-${num2}`;
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');
  
  // Testa conexão
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
    throw error;
  }

  // Limpa dados existentes (opcional - comentar se quiser manter)
  // await prisma.usuarios.deleteMany();
  // await prisma.enderecos.deleteMany();

  const usuariosCriados = [];
  const enderecosCriados = [];

  for (let i = 0; i < 50; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const nomeCompleto = `${nome} ${sobrenome}`;
    const email = gerarEmail(nome, sobrenome);
    const cpf = gerarCPF();
    const dataNascimento = gerarDataNascimento();
    const senha = await bcrypt.hash('senha123', 8);

    // Seleciona região aleatória
    const regiao = regioesSP[Math.floor(Math.random() * regioesSP.length)];

    // Gera endereço
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
        latitude: regiao.lat + (Math.random() * 0.1 - 0.05), // Variação pequena
        longitude: regiao.lng + (Math.random() * 0.1 - 0.05)
      }
    });

    enderecosCriados.push(endereco);

    // Cria usuário
    const usuario = await prisma.usuarios.create({
      data: {
        name: nomeCompleto,
        cpf,
        data_nascimento: dataNascimento,
        email,
        password: senha,
        provider: 'local',
        id_endereco: endereco.id,
        saldo_carteira: Math.random() * 500 // Saldo aleatório até R$ 500
      }
    });

    usuariosCriados.push(usuario);
    console.log(`✅ Cliente ${i + 1}/50 criado: ${nomeCompleto} - ${regiao.bairro}, ${regiao.cidade}`);
  }

  console.log('\n📊 Resumo:');
  console.log(`   - ${enderecosCriados.length} endereços criados`);
  console.log(`   - ${usuariosCriados.length} clientes criados`);
  console.log(`   - Regiões: ${new Set(enderecosCriados.map(e => e.cidade)).size} cidades diferentes`);
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

