import prismaClient from '../../prisma';
import { calculateDistance } from '../../utils/calculations';

class AcompanhamentoPedidoService {
  async obterPedido(pedidoId: string, userId: string) {
    try {
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
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
          },
          pagamentos: true,
          historicoStatus: {
            orderBy: {
              data_mudanca: 'desc'
            }
          }
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      return pedido;
    } catch (error) {
      console.error('Error in AcompanhamentoPedidoService.obterPedido:', error);
      throw error;
    }
  }

  async atualizarStatus(
    pedidoId: string,
    novoStatus: string,
    observacoes?: string,
    isRestaurante: boolean = false,
    userId?: string
  ) {
    try {
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          restaurantes: true,
          pagamentos: true
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      // Validações de transição de status
      const statusValidos = [
        'PENDENTE',
        'CONFIRMADO',
        'PREPARANDO',
        'AGUARDANDO_ENTREGADOR',
        'EM_ROTA',
        'ENTREGUE',
        'CANCELADO',
        'TENTATIVA_FALHOU',
        'RECUSADO'
      ];

      if (!statusValidos.includes(novoStatus)) {
        throw new Error('Status inválido');
      }

      // Validações específicas para cancelamento
      if (novoStatus === 'CANCELADO') {
        // Usuário só pode cancelar se estiver PENDENTE ou CONFIRMADO
        if (!isRestaurante && pedido.status !== 'PENDENTE' && pedido.status !== 'CONFIRMADO') {
          throw new Error('Pedido só pode ser cancelado enquanto estiver PENDENTE ou CONFIRMADO');
        }

        // Restaurante pode cancelar em qualquer status antes de ENTREGUE
        if (isRestaurante && pedido.status === 'ENTREGUE') {
          throw new Error('Pedido já foi entregue e não pode ser cancelado');
        }

        // Se já foi pago, precisa estornar
        const pagamento = pedido.pagamentos[0];
        if (pagamento && pagamento.status === 'APROVADO') {
          // Estorna saldo da carteira se foi usado
          if (pagamento.saldo_carteira_usado > 0) {
            await prismaClient.usuarios.update({
              where: { id: pedido.id_usuario },
              data: {
                saldo_carteira: {
                  increment: pagamento.saldo_carteira_usado
                }
              }
            });
          }
        }
      }

      // Validação para recusa pelo restaurante
      if (novoStatus === 'RECUSADO' && !isRestaurante) {
        throw new Error('Apenas o restaurante pode recusar pedidos');
      }

      // Validação para recusa - só pode recusar se estiver PENDENTE
      if (novoStatus === 'RECUSADO' && pedido.status !== 'PENDENTE') {
        throw new Error('Pedido só pode ser recusado enquanto estiver PENDENTE');
      }

      // Atualiza pedido
      const updateData: any = {
        status: novoStatus
      };

      const agora = new Date();

      switch (novoStatus) {
        case 'CONFIRMADO':
          updateData.data_confirmacao = agora;
          break;
        case 'PREPARANDO':
          updateData.data_preparando = agora;
          break;
        case 'AGUARDANDO_ENTREGADOR':
          updateData.data_saiu_entrega = agora;
          break;
        case 'EM_ROTA':
          // Quando pedido sai para entrega, atualiza data_saiu_entrega e data_em_rota
          if (!pedido.data_saiu_entrega) {
            updateData.data_saiu_entrega = agora;
          }
          updateData.data_em_rota = agora;
          break;
        case 'ENTREGUE':
          updateData.data_entregue = agora;
          break;
        case 'CANCELADO':
          updateData.data_cancelado = agora;
          updateData.motivo_cancelamento = observacoes || 'Cancelado pelo usuário';
          break;
        case 'RECUSADO':
          updateData.data_cancelado = agora;
          updateData.motivo_cancelamento = observacoes || 'Pedido recusado pelo restaurante';
          break;
      }

      await prismaClient.pedidos.update({
        where: { id: pedidoId },
        data: updateData
      });

      // Registra no histórico
      await prismaClient.historicoStatus.create({
        data: {
          id_pedido: pedidoId,
          status_anterior: pedido.status,
          status_novo: novoStatus,
          observacoes
        }
      });

      return { message: 'Status atualizado com sucesso' };
    } catch (error) {
      console.error('Error in AcompanhamentoPedidoService.atualizarStatus:', error);
      throw error;
    }
  }

  async cancelarPedido(pedidoId: string, userId: string, motivo?: string) {
    try {
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      // Valida se pode cancelar
      if (pedido.status !== 'PENDENTE' && pedido.status !== 'CONFIRMADO') {
        throw new Error('Pedido só pode ser cancelado enquanto estiver PENDENTE ou CONFIRMADO');
      }

      return await this.atualizarStatus(pedidoId, 'CANCELADO', motivo || 'Cancelado pelo usuário', false, userId);
    } catch (error) {
      console.error('Error in AcompanhamentoPedidoService.cancelarPedido:', error);
      throw error;
    }
  }

  async recusarPedido(pedidoId: string, restauranteId: string, motivo: string) {
    try {
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_restaurante !== restauranteId) {
        throw new Error('Pedido não pertence a este restaurante');
      }

      // Valida se pode recusar
      if (pedido.status !== 'PENDENTE') {
        throw new Error('Pedido só pode ser recusado enquanto estiver PENDENTE');
      }

      if (!motivo) {
        throw new Error('Motivo da recusa é obrigatório');
      }

      return await this.atualizarStatus(pedidoId, 'RECUSADO', motivo, true);
    } catch (error) {
      console.error('Error in AcompanhamentoPedidoService.recusarPedido:', error);
      throw error;
    }
  }

  async alterarEndereco(pedidoId: string, userId: string, novoEnderecoId: string) {
    try {
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          restaurantes: {
            include: {
              enderecos: true
            }
          }
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      // Só pode alterar endereço se estiver PENDENTE
      if (pedido.status !== 'PENDENTE') {
        throw new Error('Endereço só pode ser alterado enquanto o pedido estiver PENDENTE');
      }

      // Verifica se o novo endereço existe
      const novoEndereco = await prismaClient.enderecos.findUnique({
        where: { id: novoEnderecoId }
      });

      if (!novoEndereco) {
        throw new Error('Endereço não encontrado');
      }

      // Verifica se o restaurante atende no novo endereço
      if (pedido.restaurantes.enderecos.latitude && pedido.restaurantes.enderecos.longitude &&
          novoEndereco.latitude && novoEndereco.longitude) {
        const distancia = calculateDistance(
          pedido.restaurantes.enderecos.latitude!,
          pedido.restaurantes.enderecos.longitude!,
          novoEndereco.latitude!,
          novoEndereco.longitude!
        );

        if (distancia > (pedido.restaurantes.raio_entrega || 10)) {
          throw new Error('Restaurante não atende neste endereço (fora do raio de entrega)');
        }
      }

      // Atualiza endereço
      await prismaClient.pedidos.update({
        where: { id: pedidoId },
        data: {
          id_endereco: novoEnderecoId,
          latitude_entrega: novoEndereco.latitude,
          longitude_entrega: novoEndereco.longitude
        }
      });

      // Registra no histórico
      await prismaClient.historicoStatus.create({
        data: {
          id_pedido: pedidoId,
          status_anterior: pedido.status,
          status_novo: pedido.status,
          observacoes: `Endereço alterado para: ${novoEndereco.rua}, ${novoEndereco.numero}`
        }
      });

      return { message: 'Endereço alterado com sucesso' };
    } catch (error) {
      console.error('Error in AcompanhamentoPedidoService.alterarEndereco:', error);
      throw error;
    }
  }

  async atualizarItemPedido(pedidoId: string, itemId: string, userId: string, dadosAtualizacao: {
    quantidade?: number;
    observacoes?: string;
    personalizacoes?: any;
  }) {
    try {
      // Verifica se o pedido existe e pertence ao usuário
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          itensPedido: {
            include: {
              produtos: true
            }
          }
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      // Só pode alterar item se o pedido estiver PENDENTE
      if (pedido.status !== 'PENDENTE') {
        throw new Error('Itens só podem ser alterados enquanto o pedido estiver PENDENTE');
      }

      // Verifica se o item existe no pedido
      const item = pedido.itensPedido.find(i => i.id === itemId);
      if (!item) {
        throw new Error('Item não encontrado no pedido');
      }

      const updateData: any = {};

      // Atualiza quantidade se fornecida
      if (dadosAtualizacao.quantidade !== undefined) {
        if (dadosAtualizacao.quantidade <= 0) {
          throw new Error('Quantidade deve ser maior que zero');
        }

        // Verifica estoque do produto
        const produto = item.produtos;
        if (produto.estoque !== null && dadosAtualizacao.quantidade > produto.estoque) {
          throw new Error('Estoque insuficiente');
        }

        if (produto.quantidade_maxima_pedido && dadosAtualizacao.quantidade > produto.quantidade_maxima_pedido) {
          throw new Error(`Quantidade máxima permitida: ${produto.quantidade_maxima_pedido}`);
        }

        updateData.quantidade = dadosAtualizacao.quantidade;
        updateData.subtotal = item.preco_unitario * dadosAtualizacao.quantidade;
      }

      // Atualiza observações se fornecidas
      if (dadosAtualizacao.observacoes !== undefined) {
        updateData.observacoes = dadosAtualizacao.observacoes;
      }

      // Atualiza personalizações se fornecidas
      if (dadosAtualizacao.personalizacoes !== undefined) {
        updateData.personalizacoes = JSON.stringify(dadosAtualizacao.personalizacoes);
      }

      // Atualiza o item
      await prismaClient.itensPedido.update({
        where: { id: itemId },
        data: updateData
      });

      // Recalcula o subtotal e total do pedido
      const itensAtualizados = await prismaClient.itensPedido.findMany({
        where: { id_pedido: pedidoId }
      });

      const novoSubtotal = itensAtualizados.reduce((sum, item) => sum + item.subtotal, 0);
      const novoTotal = novoSubtotal + pedido.taxa_entrega - pedido.desconto;

      await prismaClient.pedidos.update({
        where: { id: pedidoId },
        data: {
          subtotal: novoSubtotal,
          total: novoTotal
        }
      });

      return { message: 'Item atualizado com sucesso' };
    } catch (error) {
      console.error('Error in AcompanhamentoPedidoService.atualizarItemPedido:', error);
      throw error;
    }
  }
}

export default AcompanhamentoPedidoService;



