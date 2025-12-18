import prismaClient from '../../prisma';

class NotaFiscalService {
  async gerarNotaFiscal(pedidoId: string, userId: string) {
    try {
      // Busca o pedido completo com todos os relacionamentos
      const pedido = await prismaClient.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          usuarios: {
            include: {
              enderecos: true
            }
          },
          restaurantes: {
            include: {
              enderecos: true
            }
          },
          enderecos: true,
          itensPedido: {
            include: {
              produtos: {
                include: {
                  categorias: true
                }
              }
            }
          },
          pagamentos: true,
          cupons: true
        }
      });

      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.id_usuario !== userId) {
        throw new Error('Pedido não pertence a este usuário');
      }

      // Gera número da NF (formato: NF + ano + sequencial baseado no ID)
      const numeroNF = this.gerarNumeroNF(pedido.id, pedido.data_pedido);

      // Formata a Nota Fiscal
      const notaFiscal = {
        // Cabeçalho
        numero: numeroNF,
        serie: '001',
        tipo: 'NF-e',
        dataEmissao: new Date().toISOString(),
        dataPedido: pedido.data_pedido.toISOString(),

        // Dados do Emitente (Restaurante)
        emitente: {
          nome: pedido.restaurantes.name,
          nomeFantasia: pedido.restaurantes.nome_fantasia || pedido.restaurantes.name,
          cnpj: pedido.restaurantes.cnpj,
          endereco: {
            rua: pedido.restaurantes.enderecos.rua,
            numero: pedido.restaurantes.enderecos.numero,
            complemento: pedido.restaurantes.enderecos.complemento,
            bairro: pedido.restaurantes.enderecos.bairro,
            cidade: pedido.restaurantes.enderecos.cidade,
            estado: pedido.restaurantes.enderecos.estado,
            cep: pedido.restaurantes.enderecos.cep
          },
          telefone: pedido.restaurantes.telefone,
          email: pedido.restaurantes.email
        },

        // Dados do Destinatário (Cliente)
        destinatario: {
          nome: pedido.usuarios.name,
          cpf: pedido.usuarios.cpf || 'Não informado',
          email: pedido.usuarios.email,
          endereco: {
            rua: pedido.enderecos.rua,
            numero: pedido.enderecos.numero,
            complemento: pedido.enderecos.complemento,
            bairro: pedido.enderecos.bairro,
            cidade: pedido.enderecos.cidade,
            estado: pedido.enderecos.estado,
            cep: pedido.enderecos.cep
          }
        },

        // Itens do Pedido
        itens: pedido.itensPedido.map((item, index) => ({
          numero: index + 1,
          codigo: item.produtos.id.substring(0, 8).toUpperCase(),
          descricao: item.produtos.name_produto,
          categoria: item.produtos.categorias.name,
          quantidade: item.quantidade,
          unidade: 'UN',
          valorUnitario: item.preco_unitario,
          valorTotal: item.subtotal,
          observacoes: item.observacoes || null
        })),

        // Totais
        totais: {
          subtotal: pedido.subtotal,
          taxaEntrega: pedido.taxa_entrega,
          desconto: pedido.desconto || 0,
          total: pedido.total
        },

        // Informações de Entrega
        entrega: {
          tipo: pedido.tipo_entrega,
          tempoEstimado: pedido.tempo_total_estimado || 0,
          observacoes: pedido.observacoes || null
        },

        // Pagamento
        pagamento: pedido.pagamentos.map(pag => ({
          forma: pag.forma_pagamento,
          valor: pag.valor,
          status: pag.status,
          dataPagamento: pag.data_pagamento?.toISOString() || null,
          saldoCarteiraUsado: pag.saldo_carteira_usado || 0
        })),

        // Cupom (se houver)
        cupom: pedido.cupons ? {
          codigo: pedido.cupons.codigo,
          desconto: pedido.desconto || 0
        } : null,

        // Status do Pedido
        status: pedido.status,
        dataEntregue: pedido.data_entregue?.toISOString() || null,

        // Chave de Acesso (simulada)
        chaveAcesso: this.gerarChaveAcesso(pedido.id, numeroNF)
      };

      return notaFiscal;
    } catch (error) {
      console.error('Error in NotaFiscalService.gerarNotaFiscal:', error);
      throw error;
    }
  }

  private gerarNumeroNF(pedidoId: string, dataPedido: Date): string {
    // Gera número da NF baseado no ID do pedido e data
    const ano = dataPedido.getFullYear();
    const sequencial = pedidoId.substring(0, 8).toUpperCase();
    return `NF${ano}${sequencial}`;
  }

  private gerarChaveAcesso(pedidoId: string, numeroNF: string): string {
    // Gera chave de acesso simulada (44 dígitos)
    const timestamp = Date.now().toString();
    const hash = pedidoId.substring(0, 8).toUpperCase();
    const chave = `${numeroNF}${timestamp}${hash}`.substring(0, 44).padEnd(44, '0');
    
    // Formata: XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX
    return chave.match(/.{1,4}/g)?.join(' ') || chave;
  }
}

export default NotaFiscalService;












