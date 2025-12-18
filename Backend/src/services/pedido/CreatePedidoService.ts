import prismaClient from '../../prisma';
import { calcularTempoEstimado, calcularTempoEstimadoComPico } from '../../utils/calculations';
import CupomService from '../cupom/CupomService';
import CarrinhoService from '../carrinho/CarrinhoService';
import CartaoService from '../pagamento/CartaoService';

interface ItemPedido {
  produtoId: string;
  quantidade: number;
  observacoes?: string;
  personalizacoes?: any;
  opcoes?: string[];
}

class CreatePedidoService {
  async execute(
    userId: string,
    formaPagamento: string,
    codigoCupom?: string,
    tipoEntrega?: string
  ) {
    try {
      // Busca o carrinho do usuário
      const carrinhoService = new CarrinhoService();
      const carrinhoData = await carrinhoService.obterCarrinho(userId);

      if (!carrinhoData.itens || carrinhoData.itens.length === 0) {
        throw new Error('Carrinho está vazio');
      }

      // Pega o primeiro item para identificar o restaurante
      const primeiroItem = carrinhoData.itens[0];
      const produto = await prismaClient.produtos.findUnique({
        where: { id: primeiroItem.produto.id },
        include: { restaurantes: true }
      });

      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      const restauranteId = produto.id_restaurante;
      const restaurante = await prismaClient.restaurantes.findUnique({
        where: { id: restauranteId },
        include: { enderecos: true }
      });

      if (!restaurante || !restaurante.ativo) {
        throw new Error('Restaurante não encontrado ou inativo');
      }

      // Busca endereço do usuário
      const usuario = await prismaClient.usuarios.findUnique({
        where: { id: userId },
        include: { enderecos: true }
      });

      if (!usuario || !usuario.id_endereco) {
        throw new Error('Usuário não possui endereço cadastrado');
      }

      const enderecoId = usuario.id_endereco;
      const endereco = await prismaClient.enderecos.findUnique({
        where: { id: enderecoId }
      });

      if (!endereco) {
        throw new Error('Endereço não encontrado');
      }

      // Busca cartão se forma de pagamento for crédito
      let cartao = null;
      if (formaPagamento === 'credito') {
        const cartaoService = new CartaoService();
        const cartoes = await cartaoService.listarCartoes(userId);
        
        if (cartoes.length === 0) {
          throw new Error('Nenhum cartão cadastrado. Cadastre um cartão antes de fazer pedido com crédito.');
        }

        // Busca o cartão padrão ou o primeiro
        cartao = cartoes.find(c => c.padrao) || cartoes[0];
      }

      // Converte itens do carrinho para formato do pedido
      const itens = carrinhoData.itens;
      let subtotal = 0;
      const itensPedido = [];

      for (const item of itens) {
        const produtoItem = await prismaClient.produtos.findUnique({
          where: { id: item.produto.id },
          include: { opcoesProduto: true }
        });

        if (!produtoItem || !produtoItem.ativo || !produtoItem.disponivel) {
          throw new Error(`Produto ${item.produto.name_produto} não disponível`);
        }

        if (produtoItem.estoque !== null && produtoItem.estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${produtoItem.name_produto}`);
        }

        // Usa o preço_unitario do carrinho (já calculado com opções) ou o preço do produto
        const precoUnitario = item.preco_unitario || item.produto.preco;
        const subtotalItem = item.subtotal || (precoUnitario * item.quantidade);
        subtotal += subtotalItem;

        itensPedido.push({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
          preco_unitario: precoUnitario,
          subtotal: subtotalItem,
          observacoes: item.observacoes || null,
          personalizacoes: item.personalizacoes ? JSON.stringify(item.personalizacoes) : null
        });
      }

      // Valida valor mínimo
      if (subtotal < restaurante.valor_minimo_pedido) {
        throw new Error(
          `Valor mínimo do pedido: R$ ${restaurante.valor_minimo_pedido.toFixed(2)}`
        );
      }

      // Aplica cupom se fornecido
      let desconto = 0;
      let cupomId = null;
      if (codigoCupom) {
        const cupomService = new CupomService();
        const validacao = await cupomService.validarCupom(
          codigoCupom,
          userId,
          restauranteId,
          subtotal
        );
        desconto = validacao.desconto;
        cupomId = validacao.cupom.id;
      }

      // Calcula taxa de entrega
      let taxaEntrega = 0;
      if (tipoEntrega && tipoEntrega !== 'retirada') {
        taxaEntrega = restaurante.taxa_entrega || 0;
        
        // Verifica entrega grátis
        if (restaurante.entrega_gratis && 
            restaurante.valor_minimo_entrega_gratis &&
            subtotal >= restaurante.valor_minimo_entrega_gratis) {
          taxaEntrega = 0;
        }
      }

      const total = subtotal + taxaEntrega - desconto;

      // Calcula tempos estimados
      const tempoPreparo = restaurante.tempo_medio_preparo || 30;
      const tempoEntrega = (tipoEntrega && tipoEntrega === 'retirada') ? 0 : (restaurante.tempo_medio_entrega || 30);
      
      // Calcula tempo considerando horários de pico
      const tempoTotal = calcularTempoEstimadoComPico(tempoPreparo, tempoEntrega, tipoEntrega || 'padrao');

      // Cria pedido com status CONFIRMADO (pedido feito)
      const pedido = await prismaClient.pedidos.create({
        data: {
          id_restaurante: restauranteId,
          id_usuario: userId,
          id_endereco: enderecoId,
          id_cupom: cupomId,
          subtotal,
          taxa_entrega: taxaEntrega,
          desconto,
          total,
          status: 'CONFIRMADO',
          tipo_entrega: tipoEntrega || 'padrao',
          valor_troco: null,
          tempo_estimado_preparo: tempoPreparo,
          tempo_estimado_entrega: tempoEntrega,
          tempo_total_estimado: tempoTotal,
          latitude_entrega: endereco.latitude,
          longitude_entrega: endereco.longitude,
          data_confirmacao: new Date(),
          itensPedido: {
            create: itensPedido.map(item => ({
              id_produto: item.produtoId,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
              subtotal: item.subtotal,
              observacoes: item.observacoes,
              personalizacoes: item.personalizacoes
            }))
          },
          historicoStatus: {
            create: {
              status_novo: 'CONFIRMADO',
              observacoes: 'Pedido criado e confirmado'
            }
          }
        },
        include: {
          restaurantes: {
            include: {
              enderecos: true
            }
          },
          enderecos: true,
          itensPedido: {
            include: {
              produtos: true
            }
          }
        }
      });

      // Aplica cupom se válido
      if (codigoCupom && cupomId) {
        const cupomService = new CupomService();
        await cupomService.aplicarCupom(codigoCupom, userId, pedido.id);
      }

      // Limpa carrinho
      await prismaClient.carrinho.deleteMany({
        where: {
          id_usuario: userId
        }
      });

      return {
        pedido,
        carrinho: carrinhoData,
        cartao: cartao
      };
    } catch (error) {
      console.error('Error in CreatePedidoService:', error);
      throw error;
    }
  }
}

export default CreatePedidoService;



