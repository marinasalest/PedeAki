import prismaClient from '../../prisma';
import crypto from 'crypto';

class PagamentoService {
  async processarPagamento(
    pedidoId: string,
    userId: string,
    formaPagamento: string,
    dadosPagamento: any
  ) {
    try {
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          usuarios: true
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.status !== 'PENDENTE') {
        throw new Error('Pedido já foi processado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      let pagamentoData: any = {
        id_pedido: pedidoId,
        id_usuario: userId,
        forma_pagamento: formaPagamento,
        valor: pedido.total,
        status: 'PENDENTE'
      };

      // Processa conforme forma de pagamento
      switch (formaPagamento) {
        case 'pix':
          pagamentoData.qr_code_pix = this.gerarQRCodePix(pedido.total);
          pagamentoData.pix_expira_em = new Date();
          pagamentoData.pix_expira_em.setMinutes(
            pagamentoData.pix_expira_em.getMinutes() + 10
          );
          break;

        case 'credito':
        case 'debito':
          pagamentoData.numero_cartao = dadosPagamento.numero_cartao;
          pagamentoData.nome_titular = dadosPagamento.nome_titular;
          pagamentoData.validade_cartao = dadosPagamento.validade_cartao;
          pagamentoData.cvv = dadosPagamento.cvv;
          // Aqui faria a validação com gateway de pagamento
          pagamentoData.status = 'APROVADO';
          pagamentoData.data_aprovacao = new Date();
          break;

        case 'carteira':
          const usuario = await prismaClient.usuarios.findUnique({
            where: { id: userId }
          });

          if (!usuario || usuario.saldo_carteira < pedido.total) {
            throw new Error('Saldo insuficiente na carteira');
          }

          // Atualiza saldo
          await prismaClient.usuarios.update({
            where: { id: userId },
            data: {
              saldo_carteira: usuario.saldo_carteira - pedido.total
            }
          });

          pagamentoData.saldo_carteira_usado = pedido.total;
          pagamentoData.status = 'APROVADO';
          pagamentoData.data_aprovacao = new Date();
          break;

        case 'carteira_parcial':
          // Pagamento dividido: parte na carteira, parte em outro método
          const usuarioParcial = await prismaClient.usuarios.findUnique({
            where: { id: userId }
          });

          if (!usuarioParcial) {
            throw new Error('Usuário não encontrado');
          }

          const valorCarteira = dadosPagamento.valorCarteira || 0;
          const formaComplementar = dadosPagamento.formaComplementar; // 'credito', 'debito', 'pix'
          const dadosComplementar = dadosPagamento.dadosComplementar || {};

          if (valorCarteira < 0 || valorCarteira > pedido.total) {
            throw new Error('Valor da carteira inválido');
          }

          if (valorCarteira > usuarioParcial.saldo_carteira) {
            throw new Error('Saldo insuficiente na carteira');
          }

          const valorRestante = pedido.total - valorCarteira;

          // Processa parte complementar
          if (valorRestante > 0) {
            switch (formaComplementar) {
              case 'credito':
              case 'debito':
                pagamentoData.numero_cartao = dadosComplementar.numero_cartao;
                pagamentoData.nome_titular = dadosComplementar.nome_titular;
                pagamentoData.validade_cartao = dadosComplementar.validade_cartao;
                pagamentoData.cvv = dadosComplementar.cvv;
                pagamentoData.status = 'APROVADO';
                pagamentoData.data_aprovacao = new Date();
                break;

              case 'pix':
                pagamentoData.qr_code_pix = this.gerarQRCodePix(valorRestante);
                pagamentoData.pix_expira_em = new Date();
                pagamentoData.pix_expira_em.setMinutes(
                  pagamentoData.pix_expira_em.getMinutes() + 10
                );
                // PIX precisa ser aprovado depois
                pagamentoData.status = 'PENDENTE';
                break;

              default:
                throw new Error('Forma de pagamento complementar inválida');
            }
          }

          // Atualiza saldo da carteira
          await prismaClient.usuarios.update({
            where: { id: userId },
            data: {
              saldo_carteira: usuarioParcial.saldo_carteira - valorCarteira
            }
          });

          pagamentoData.saldo_carteira_usado = valorCarteira;
          pagamentoData.forma_pagamento = `carteira_${formaComplementar}`;
          
          // Se só usou carteira, aprova imediatamente
          if (valorRestante === 0) {
            pagamentoData.status = 'APROVADO';
            pagamentoData.data_aprovacao = new Date();
          }
          break;

        case 'dinheiro':
          if (dadosPagamento.valor_troco) {
            pagamentoData.valor_troco = dadosPagamento.valor_troco;
          }
          pagamentoData.status = 'APROVADO';
          pagamentoData.data_aprovacao = new Date();
          break;

        default:
          throw new Error('Forma de pagamento inválida');
      }

      // Cria pagamento
      const pagamento = await prismaClient.pagamentos.create({
        data: pagamentoData
      });

      // Se pagamento aprovado, confirma pedido
      if (pagamento.status === 'APROVADO') {
        await prismaClient.pedidos.update({
          where: { id: pedidoId },
          data: {
            status: 'CONFIRMADO',
            data_confirmacao: new Date()
          }
        });

        await prismaClient.historicoStatus.create({
          data: {
            id_pedido: pedidoId,
            status_anterior: 'PENDENTE',
            status_novo: 'CONFIRMADO',
            observacoes: 'Pagamento aprovado'
          }
        });
      }

      return pagamento;
    } catch (error) {
      console.error('Error in PagamentoService.processarPagamento:', error);
      throw error;
    }
  }

  private gerarQRCodePix(valor: number): string {
    // Gera um QR Code simulado (em produção, usar biblioteca de PIX)
    const qrCode = crypto.randomBytes(32).toString('hex');
    return `00020126580014br.gov.bcb.pix0136${qrCode}520400005303986540${valor.toFixed(2)}5802BR5925PEDEAKI DELIVERY6009SAO PAULO62070503***6304`;
  }
}

export default PagamentoService;



