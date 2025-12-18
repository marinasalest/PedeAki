const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Formas de pagamento disponíveis
const formasPagamento = [
  { tipo: 'credito', nome: 'Cartão de Crédito' },
  { tipo: 'debito', nome: 'Cartão de Débito' },
  { tipo: 'pix', nome: 'PIX' },
  { tipo: 'dinheiro', nome: 'Dinheiro' },
  { tipo: 'carteira', nome: 'Carteira Digital' }
];

// Bandeiras de cartão
const bandeiras = ['Visa', 'Mastercard', 'Elo', 'American Express'];

// Comentários de avaliação
const comentariosPositivos = [
  'Excelente comida! Recomendo muito.',
  'Muito bom, entrega rápida e comida quentinha.',
  'Adorei! Vou pedir novamente.',
  'Comida deliciosa, superou minhas expectativas.',
  'Ótimo atendimento e comida de qualidade.',
  'Entrega no prazo e comida muito saborosa.',
  'Recomendo! Melhor restaurante da região.',
  'Comida caseira e muito gostosa.',
  'Preço justo e qualidade excelente.',
  'Superou todas as expectativas!'
];

const comentariosNegativos = [
  'Comida chegou fria.',
  'Atraso na entrega.',
  'Faltou um item no pedido.',
  'Comida não estava como esperado.',
  'Atendimento poderia ser melhor.'
];

// Motivos de denúncia
const motivosDenuncia = [
  'Pedido errado',
  'Item faltando',
  'Atraso significativo na entrega',
  'Comida estragada',
  'Problema com o pagamento'
];

// Gera número de cartão fake
function gerarNumeroCartao(bandeira) {
  const prefixos = {
    'Visa': '4',
    'Mastercard': '5',
    'Elo': '5',
    'American Express': '3'
  };
  const prefixo = prefixos[bandeira] || '4';
  let numero = prefixo;
  for (let i = 0; i < 15; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return numero;
}

// Gera validade de cartão
function gerarValidadeCartao() {
  const mes = Math.floor(Math.random() * 12) + 1;
  const ano = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
  return `${mes.toString().padStart(2, '0')}/${ano}`;
}

// Gera CVV
function gerarCVV() {
  return Math.floor(Math.random() * 900) + 100;
}

// Gera nome do titular
function gerarNomeTitular() {
  const nomes = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Fernanda'];
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues'];
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return nome + ' ' + sobrenome;
}

async function main() {
  console.log('🌱 Iniciando seed de pedidos, avaliações e pagamentos...\n');
  console.log('📡 Conectando ao banco de dados...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    throw error;
  }

  // Busca dados existentes
  const usuarios = await prisma.usuarios.findMany({
    include: {
      enderecos: true
    }
  });
  const restaurantes = await prisma.restaurantes.findMany();
  const produtos = await prisma.produtos.findMany({
    where: {
      disponivel: true,
      estoque: {
        gt: 0
      }
    }
  });

  if (usuarios.length === 0) {
    console.error('❌ Nenhum usuário encontrado! Execute primeiro: npm run seed:clientes');
    process.exit(1);
  }

  if (restaurantes.length === 0) {
    console.error('❌ Nenhum restaurante encontrado! Execute primeiro: npm run seed:restaurantes');
    process.exit(1);
  }

  if (produtos.length === 0) {
    console.log('⚠️  Nenhum produto disponível encontrado. Criando pedidos sem itens...');
  }

  console.log(`📋 Encontrados:`);
  console.log(`   - ${usuarios.length} usuários`);
  console.log(`   - ${restaurantes.length} restaurantes`);
  console.log(`   - ${produtos.length} produtos disponíveis\n`);

  const pedidosCriados = [];
  const pagamentosCriados = [];
  const avaliacoesCriadas = [];
  const itensPedidoCriados = [];

  // Agrupa produtos por restaurante
  const produtosPorRestaurante = {};
  for (const produto of produtos) {
    if (!produtosPorRestaurante[produto.id_restaurante]) {
      produtosPorRestaurante[produto.id_restaurante] = [];
    }
    produtosPorRestaurante[produto.id_restaurante].push(produto);
  }

  console.log('📦 Criando 3 pedidos para cada cliente...\n');

  for (const usuario of usuarios) {
    if (!usuario.enderecos) {
      console.log(`⚠️  Usuário ${usuario.name} sem endereço, pulando...`);
      continue;
    }

    const enderecoUsuario = usuario.enderecos;
    
    // Define cenário para o cliente
    // 30% - 3 pedidos no mesmo restaurante
    // 40% - 2 pedidos no mesmo restaurante, 1 em outro
    // 30% - 3 pedidos em restaurantes diferentes
    const cenario = Math.random();
    let restaurantesSelecionados = [];

    if (cenario < 0.3) {
      // Cenário 1: 3 pedidos no mesmo restaurante
      const restaurante = restaurantes[Math.floor(Math.random() * restaurantes.length)];
      restaurantesSelecionados = [restaurante, restaurante, restaurante];
      console.log(`👤 ${usuario.name}: 3 pedidos no mesmo restaurante (${restaurante.name})`);
    } else if (cenario < 0.7) {
      // Cenário 2: 2 pedidos no mesmo restaurante, 1 em outro
      const restaurante1 = restaurantes[Math.floor(Math.random() * restaurantes.length)];
      let restaurante2;
      do {
        restaurante2 = restaurantes[Math.floor(Math.random() * restaurantes.length)];
      } while (restaurante2.id === restaurante1.id);
      restaurantesSelecionados = [restaurante1, restaurante1, restaurante2];
      console.log(`👤 ${usuario.name}: 2 pedidos em ${restaurante1.name}, 1 em ${restaurante2.name}`);
    } else {
      // Cenário 3: 3 pedidos em restaurantes diferentes
      const indices = [];
      while (indices.length < 3) {
        const idx = Math.floor(Math.random() * restaurantes.length);
        if (!indices.includes(idx)) {
          indices.push(idx);
        }
      }
      restaurantesSelecionados = indices.map(i => restaurantes[i]);
      console.log(`👤 ${usuario.name}: 3 pedidos em restaurantes diferentes`);
    }

    // Cria 3 pedidos para o cliente
    for (let i = 0; i < 3; i++) {
      const restaurante = restaurantesSelecionados[i];
      const produtosRestaurante = produtosPorRestaurante[restaurante.id] || [];

      // Gera itens do pedido
      const numItens = Math.floor(Math.random() * 3) + 1; // 1 a 3 itens
      const itensSelecionados = [];
      let subtotal = 0;

      if (produtosRestaurante.length > 0) {
        // Seleciona produtos aleatórios (pode repetir no mesmo restaurante)
        for (let j = 0; j < numItens; j++) {
          const produto = produtosRestaurante[Math.floor(Math.random() * produtosRestaurante.length)];
          const quantidade = Math.floor(Math.random() * 2) + 1; // 1 a 2 unidades
          const precoUnitario = produto.preco;
          const subtotalItem = precoUnitario * quantidade;
          subtotal += subtotalItem;

          itensSelecionados.push({
            produto,
            quantidade,
            precoUnitario,
            subtotal: subtotalItem
          });
        }
      } else {
        // Se não há produtos, cria pedido com valores fictícios
        subtotal = Math.random() * 50 + 20; // R$ 20 a R$ 70
      }

      // Verifica valor mínimo do restaurante
      if (subtotal < restaurante.valor_minimo_pedido) {
        subtotal = restaurante.valor_minimo_pedido + Math.random() * 10;
      }

      const taxaEntrega = restaurante.taxa_entrega;
      const desconto = Math.random() > 0.7 ? Math.random() * 10 : 0; // 30% chance de desconto
      const total = subtotal + taxaEntrega - desconto;

      // Status do pedido (80% entregue, 20% cancelado)
      const statuses = ['ENTREGUE', 'ENTREGUE', 'ENTREGUE', 'ENTREGUE', 'CANCELADO'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Datas (distribuídas nos últimos 30 dias)
      const diasAtras = Math.floor(Math.random() * 30);
      const dataPedido = new Date();
      dataPedido.setDate(dataPedido.getDate() - diasAtras);
      dataPedido.setHours(Math.floor(Math.random() * 12) + 10, Math.floor(Math.random() * 60), 0, 0);

      const dataEntregue = status === 'ENTREGUE' 
        ? new Date(dataPedido.getTime() + (Math.random() * 60 + 30) * 60000) // 30 a 90 min depois
        : null;

      try {
        // Cria pedido
        const pedido = await prisma.pedidos.create({
          data: {
            data_pedido: dataPedido,
            subtotal,
            taxa_entrega: taxaEntrega,
            desconto,
            total,
            observacoes: Math.random() > 0.7 ? 'Sem cebola, por favor' : null,
            status,
            tempo_estimado_preparo: restaurante.tempo_medio_preparo,
            tempo_estimado_entrega: restaurante.tempo_medio_entrega,
            tempo_total_estimado: restaurante.tempo_medio_preparo + restaurante.tempo_medio_entrega,
            tipo_entrega: Math.random() > 0.3 ? 'padrao' : 'prioritaria',
            valor_troco: null,
            latitude_entrega: enderecoUsuario.latitude,
            longitude_entrega: enderecoUsuario.longitude,
            data_confirmacao: new Date(dataPedido.getTime() + 5 * 60000),
            data_preparando: new Date(dataPedido.getTime() + 10 * 60000),
            data_entregue: dataEntregue,
            id_restaurante: restaurante.id,
            id_usuario: usuario.id,
            id_endereco: enderecoUsuario.id,
            id_cupom: null
          }
        });

        pedidosCriados.push(pedido);

        // Cria itens do pedido
        for (const item of itensSelecionados) {
          try {
            const itemPedido = await prisma.itensPedido.create({
              data: {
                quantidade: item.quantidade,
                preco_unitario: item.precoUnitario,
                subtotal: item.subtotal,
                observacoes: null,
                personalizacoes: null,
                id_pedido: pedido.id,
                id_produto: item.produto.id
              }
            });
            itensPedidoCriados.push(itemPedido);
          } catch (error) {
            console.log(`      ⚠️  Erro ao criar item: ${error.message}`);
          }
        }

        // Cria pagamento
        // Garante variedade de formas por cliente
        const formasUsuario = pagamentosCriados
          .filter(p => p.id_usuario === usuario.id)
          .map(p => p.forma_pagamento);
        
        const formasDisponiveis = formasPagamento.filter(f => !formasUsuario.includes(f.tipo));
        const formaPagamento = formasDisponiveis.length > 0 
          ? formasDisponiveis[Math.floor(Math.random() * formasDisponiveis.length)]
          : formasPagamento[Math.floor(Math.random() * formasPagamento.length)];

        let dadosPagamento = {};

        if (formaPagamento.tipo === 'credito' || formaPagamento.tipo === 'debito') {
          const bandeira = bandeiras[Math.floor(Math.random() * bandeiras.length)];
          dadosPagamento = {
            numero_cartao: gerarNumeroCartao(bandeira),
            nome_titular: gerarNomeTitular(),
            validade_cartao: gerarValidadeCartao(),
            cvv: gerarCVV().toString()
          };
        } else if (formaPagamento.tipo === 'pix') {
          dadosPagamento = {
            qr_code_pix: `pix-${pedido.id}-${Date.now()}`,
            pix_expira_em: new Date(Date.now() + 10 * 60000) // 10 minutos
          };
        } else if (formaPagamento.tipo === 'dinheiro') {
          dadosPagamento = {};
        }

        const pagamento = await prisma.pagamentos.create({
          data: {
            forma_pagamento: formaPagamento.tipo,
            ...dadosPagamento,
            valor: total,
            status: status === 'CANCELADO' ? 'RECUSADO' : 'APROVADO',
            data_aprovacao: status !== 'CANCELADO' ? new Date(dataPedido.getTime() + 2 * 60000) : null,
            saldo_carteira_usado: formaPagamento.tipo === 'carteira' ? Math.random() * total : 0,
            id_usuario: usuario.id,
            id_pedido: pedido.id
          }
        });

        pagamentosCriados.push(pagamento);

        // Cria avaliação se pedido foi entregue
        if (status === 'ENTREGUE') {
          const nota = Math.floor(Math.random() * 3) + 3; // 3 a 5
          const temComentario = Math.random() > 0.3; // 70% tem comentário
          const temDenuncia = Math.random() > 0.8; // 20% tem denúncia

          try {
            const avaliacao = await prisma.avaliacoes.create({
              data: {
                nota,
                comentario: temComentario 
                  ? (nota >= 4 
                      ? comentariosPositivos[Math.floor(Math.random() * comentariosPositivos.length)]
                      : comentariosNegativos[Math.floor(Math.random() * comentariosNegativos.length)])
                  : null,
                denuncia: temDenuncia 
                  ? motivosDenuncia[Math.floor(Math.random() * motivosDenuncia.length)]
                  : null,
                data_avaliacao: new Date(dataEntregue.getTime() + 5 * 60000), // 5 min depois da entrega
                id_restaurante: restaurante.id,
                id_pedido: pedido.id
              }
            });
            avaliacoesCriadas.push(avaliacao);
          } catch (error) {
            // Avaliação já existe ou erro
            console.log(`      ⚠️  Não foi possível criar avaliação: ${error.message}`);
          }
        }
      } catch (error) {
        console.error(`   ❌ Erro ao criar pedido ${i + 1}:`, error.message);
      }
    }
  }

  // Atualiza avaliação média dos restaurantes
  console.log('\n📊 Atualizando avaliações médias dos restaurantes...');
  for (const restaurante of restaurantes) {
    const avaliacoes = await prisma.avaliacoes.findMany({
      where: { id_restaurante: restaurante.id }
    });

    if (avaliacoes.length > 0) {
      const media = avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length;
      await prisma.restaurantes.update({
        where: { id: restaurante.id },
        data: { avaliacao: parseFloat(media.toFixed(2)) }
      });
    }
  }

  console.log('\n\n📊 Resumo:');
  console.log(`   - ${pedidosCriados.length} pedidos criados`);
  console.log(`   - ${itensPedidoCriados.length} itens de pedido criados`);
  console.log(`   - ${pagamentosCriados.length} pagamentos criados`);
  console.log(`   - ${avaliacoesCriadas.length} avaliações criadas`);
  console.log(`   - ${usuarios.length} clientes processados (3 pedidos cada)`);
  console.log('\n✅ Seed de pedidos, avaliações e pagamentos concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
