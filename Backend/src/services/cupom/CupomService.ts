import prismaClient from '../../prisma';

class CupomService {
  async validarCupom(codigo: string, userId: string, restauranteId: string, valorPedido: number) {
    try {
      const cupom = await prismaClient.cupons.findUnique({
        where: { codigo }
      });

      if (!cupom) {
        throw new Error('Cupom não encontrado');
      }

      if (!cupom.ativo) {
        throw new Error('Cupom inativo');
      }

      const agora = new Date();
      if (agora < cupom.data_inicio || agora > cupom.data_fim) {
        throw new Error('Cupom fora do período de validade');
      }

      if (cupom.uso_maximo !== null && cupom.uso_atual >= cupom.uso_maximo) {
        throw new Error('Cupom esgotado');
      }

      if (cupom.valor_minimo_pedido && valorPedido < cupom.valor_minimo_pedido) {
        throw new Error(`Valor mínimo do pedido: R$ ${cupom.valor_minimo_pedido.toFixed(2)}`);
      }

      if (cupom.exclusivo_restaurante && cupom.id_restaurante !== restauranteId) {
        throw new Error('Cupom não válido para este restaurante');
      }

      // Verifica se usuário já usou este cupom
      const jaUsou = await prismaClient.usoCupons.findUnique({
        where: {
          id_usuario_id_cupom: {
            id_usuario: userId,
            id_cupom: cupom.id
          }
        }
      });

      if (jaUsou) {
        throw new Error('Cupom já utilizado por este usuário');
      }

      // Calcula desconto
      let desconto = 0;
      if (cupom.tipo_desconto === 'percentual') {
        desconto = (valorPedido * cupom.valor_desconto) / 100;
      } else {
        desconto = cupom.valor_desconto;
      }

      // Não permite desconto maior que o valor do pedido
      if (desconto > valorPedido) {
        desconto = valorPedido;
      }

      return {
        cupom: {
          id: cupom.id,
          codigo: cupom.codigo,
          descricao: cupom.descricao,
          tipo_desconto: cupom.tipo_desconto,
          valor_desconto: cupom.valor_desconto
        },
        desconto
      };
    } catch (error) {
      console.error('Error in CupomService.validarCupom:', error);
      throw error;
    }
  }

  async aplicarCupom(codigo: string, userId: string, pedidoId: string) {
    try {
      const cupom = await prismaClient.cupons.findUnique({
        where: { codigo }
      });

      if (!cupom) {
        throw new Error('Cupom não encontrado');
      }

      // Registra uso do cupom
      await prismaClient.usoCupons.create({
        data: {
          id_usuario: userId,
          id_cupom: cupom.id
        }
      });

      // Atualiza contador de uso
      await prismaClient.cupons.update({
        where: { id: cupom.id },
        data: {
          uso_atual: cupom.uso_atual + 1
        }
      });

      // Associa cupom ao pedido
      await prismaClient.pedidos.update({
        where: { id: pedidoId },
        data: {
          id_cupom: cupom.id
        }
      });

      return cupom;
    } catch (error) {
      console.error('Error in CupomService.aplicarCupom:', error);
      throw error;
    }
  }
}

export default CupomService;















