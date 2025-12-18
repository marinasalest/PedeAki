import prismaClient from '../../prisma';

class AvaliacaoService {
  async criarAvaliacao(
    pedidoId: string,
    userId: string,
    nota: number,
    comentario?: string,
    denuncia?: string
  ) {
    try {
      // Verifica se o pedido existe e foi entregue
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          avaliacoes: true
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      if (pedido.status !== 'ENTREGUE') {
        throw new Error('Apenas pedidos entregues podem ser avaliados');
      }

      // Verifica se já foi avaliado
      if (pedido.avaliacoes && pedido.avaliacoes.length > 0) {
        throw new Error('Pedido já foi avaliado');
      }

      if (nota < 1 || nota > 5) {
        throw new Error('Nota deve ser entre 1 e 5');
      }

      // Cria avaliação
      const avaliacao = await prismaClient.avaliacoes.create({
        data: {
          id_restaurante: pedido.id_restaurante,
          id_pedido: pedidoId,
          nota,
          comentario,
          denuncia
        }
      });

      // Atualiza média de avaliação do restaurante
      await this.atualizarMediaRestaurante(pedido.id_restaurante);

      return avaliacao;
    } catch (error) {
      console.error('Error in AvaliacaoService.criarAvaliacao:', error);
      throw error;
    }
  }

  private async atualizarMediaRestaurante(restauranteId: string) {
    const avaliacoes = await prismaClient.avaliacoes.findMany({
      where: { id_restaurante: restauranteId }
    });

    if (avaliacoes.length === 0) return;

    const somaNotas = avaliacoes.reduce((sum, av) => sum + av.nota, 0);
    const media = somaNotas / avaliacoes.length;

    await prismaClient.restaurantes.update({
      where: { id: restauranteId },
      data: {
        avaliacao: Math.round(media * 10) / 10 // Arredonda para 1 casa decimal
      }
    });
  }

  async pedirNovamente(pedidoId: string, userId: string) {
    try {
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

      // Retorna itens do pedido para adicionar ao carrinho
      return pedido.itensPedido.map(item => ({
        produtoId: item.id_produto,
        quantidade: item.quantidade,
        observacoes: item.observacoes,
        personalizacoes: item.personalizacoes ? JSON.parse(item.personalizacoes) : null
      }));
    } catch (error) {
      console.error('Error in AvaliacaoService.pedirNovamente:', error);
      throw error;
    }
  }
}

export default AvaliacaoService;















