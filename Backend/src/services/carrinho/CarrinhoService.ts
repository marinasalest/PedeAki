import prismaClient from '../../prisma';
import { isProdutoDisponivel } from '../../utils/calculations';

interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
  observacoes?: string;
  personalizacoes?: any;
  opcoes?: string[];
}

class CarrinhoService {
  async adicionarItem(userId: string, item: ItemCarrinho) {
    try {
      // Verifica se o produto existe e está disponível
      const produto = await prismaClient.produtos.findUnique({
        where: { id: item.produtoId },
        include: {
          restaurantes: true
        }
      });

      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      if (!isProdutoDisponivel(
        produto.horario_inicio,
        produto.horario_fim,
        produto.disponivel,
        produto.estoque
      )) {
        throw new Error('Produto indisponível no momento');
      }

      // Verifica estoque
      if (produto.estoque !== null && produto.estoque < item.quantidade) {
        throw new Error('Estoque insuficiente');
      }

      // Verifica quantidade máxima
      if (produto.quantidade_maxima_pedido && item.quantidade > produto.quantidade_maxima_pedido) {
        throw new Error(`Quantidade máxima permitida: ${produto.quantidade_maxima_pedido}`);
      }

      // Busca ou cria carrinho
      let carrinho = await prismaClient.carrinho.findFirst({
        where: {
          id_usuario: userId,
          data_expiracao: {
            gt: new Date()
          }
        }
      });

      const itensCarrinho = carrinho ? JSON.parse(carrinho.itens) : [];
      
      // Verifica se já existe item do mesmo produto
      const itemIndex = itensCarrinho.findIndex((i: any) => 
        i.produtoId === item.produtoId && 
        JSON.stringify(i.personalizacoes) === JSON.stringify(item.personalizacoes)
      );

      if (itemIndex >= 0) {
        // Atualiza quantidade
        itensCarrinho[itemIndex].quantidade += item.quantidade;
        if (item.observacoes) {
          itensCarrinho[itemIndex].observacoes = item.observacoes;
        }
      } else {
        // Adiciona novo item
        itensCarrinho.push({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          observacoes: item.observacoes,
          personalizacoes: item.personalizacoes,
          opcoes: item.opcoes,
          preco_unitario: produto.preco
        });
      }

      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30); // Expira em 30 minutos

      if (carrinho) {
        carrinho = await prismaClient.carrinho.update({
          where: { id: carrinho.id },
          data: {
            itens: JSON.stringify(itensCarrinho),
            data_expiracao: dataExpiracao
          }
        });
      } else {
        carrinho = await prismaClient.carrinho.create({
          data: {
            id_usuario: userId,
            itens: JSON.stringify(itensCarrinho),
            data_expiracao: dataExpiracao
          }
        });
      }

      return this.calcularResumo(userId, itensCarrinho);
    } catch (error) {
      console.error('Error in CarrinhoService.adicionarItem:', error);
      throw error;
    }
  }

  async removerItem(userId: string, itemId: string) {
    try {
      const carrinho = await prismaClient.carrinho.findFirst({
        where: {
          id_usuario: userId,
          data_expiracao: {
            gt: new Date()
          }
        }
      });

      if (!carrinho) {
        throw new Error('Carrinho não encontrado');
      }

      const itensCarrinho = JSON.parse(carrinho.itens);
      const itensAtualizados = itensCarrinho.filter((_: any, index: number) => index.toString() !== itemId);

      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30);

      await prismaClient.carrinho.update({
        where: { id: carrinho.id },
        data: {
          itens: JSON.stringify(itensAtualizados),
          data_expiracao: dataExpiracao
        }
      });

      return this.calcularResumo(userId, itensAtualizados);
    } catch (error) {
      console.error('Error in CarrinhoService.removerItem:', error);
      throw error;
    }
  }

  async atualizarQuantidade(userId: string, itemId: string, quantidade: number) {
    try {
      const carrinho = await prismaClient.carrinho.findFirst({
        where: {
          id_usuario: userId,
          data_expiracao: {
            gt: new Date()
          }
        }
      });

      if (!carrinho) {
        throw new Error('Carrinho não encontrado');
      }

      const itensCarrinho = JSON.parse(carrinho.itens);
      const itemIndex = parseInt(itemId);

      if (itemIndex < 0 || itemIndex >= itensCarrinho.length) {
        throw new Error('Item não encontrado');
      }

      if (quantidade <= 0) {
        // Remove item
        itensCarrinho.splice(itemIndex, 1);
      } else {
        // Verifica produto
        const produto = await prismaClient.produtos.findUnique({
          where: { id: itensCarrinho[itemIndex].produtoId }
        });

        if (produto?.quantidade_maxima_pedido && quantidade > produto.quantidade_maxima_pedido) {
          throw new Error(`Quantidade máxima permitida: ${produto.quantidade_maxima_pedido}`);
        }

        if (produto?.estoque !== null && quantidade > produto.estoque) {
          throw new Error('Estoque insuficiente');
        }

        itensCarrinho[itemIndex].quantidade = quantidade;
      }

      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30);

      await prismaClient.carrinho.update({
        where: { id: carrinho.id },
        data: {
          itens: JSON.stringify(itensCarrinho),
          data_expiracao: dataExpiracao
        }
      });

      return this.calcularResumo(userId, itensCarrinho);
    } catch (error) {
      console.error('Error in CarrinhoService.atualizarQuantidade:', error);
      throw error;
    }
  }

  async obterCarrinho(userId: string) {
    try {
      const carrinho = await prismaClient.carrinho.findFirst({
        where: {
          id_usuario: userId,
          data_expiracao: {
            gt: new Date()
          }
        }
      });

      if (!carrinho) {
        return {
          itens: [],
          subtotal: 0,
          taxa_entrega: 0,
          desconto: 0,
          total: 0
        };
      }

      const itensCarrinho = JSON.parse(carrinho.itens);
      return this.calcularResumo(userId, itensCarrinho);
    } catch (error) {
      console.error('Error in CarrinhoService.obterCarrinho:', error);
      throw error;
    }
  }

  async atualizarCarrinho(carrinhoId: string, userId: string, itens: ItemCarrinho[]) {
    try {
      // Verifica se o carrinho existe e pertence ao usuário
      const carrinho = await prismaClient.carrinho.findUnique({
        where: { id: carrinhoId }
      });

      if (!carrinho) {
        throw new Error('Carrinho não encontrado');
      }

      if (carrinho.id_usuario !== userId) {
        throw new Error('Carrinho não pertence ao usuário');
      }

      // Valida todos os itens antes de atualizar
      const itensValidados: any[] = [];
      for (const item of itens) {
        const produto = await prismaClient.produtos.findUnique({
          where: { id: item.produtoId },
          include: { restaurantes: true }
        });

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        if (!isProdutoDisponivel(
          produto.horario_inicio,
          produto.horario_fim,
          produto.disponivel,
          produto.estoque
        )) {
          throw new Error(`Produto ${produto.name_produto} indisponível no momento`);
        }

        if (produto.estoque !== null && produto.estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${produto.name_produto}`);
        }

        if (produto.quantidade_maxima_pedido && item.quantidade > produto.quantidade_maxima_pedido) {
          throw new Error(`Quantidade máxima permitida para ${produto.name_produto}: ${produto.quantidade_maxima_pedido}`);
        }

        itensValidados.push({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          observacoes: item.observacoes,
          personalizacoes: item.personalizacoes,
          opcoes: item.opcoes,
          preco_unitario: produto.preco
        });
      }

      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30);

      await prismaClient.carrinho.update({
        where: { id: carrinhoId },
        data: {
          itens: JSON.stringify(itensValidados),
          data_expiracao: dataExpiracao
        }
      });

      return this.calcularResumo(userId, itensValidados);
    } catch (error) {
      console.error('Error in CarrinhoService.atualizarCarrinho:', error);
      throw error;
    }
  }

  async esvaziarCarrinho(carrinhoId: string, userId: string) {
    try {
      // Verifica se o carrinho existe e pertence ao usuário
      const carrinho = await prismaClient.carrinho.findUnique({
        where: { id: carrinhoId }
      });

      if (!carrinho) {
        throw new Error('Carrinho não encontrado');
      }

      if (carrinho.id_usuario !== userId) {
        throw new Error('Carrinho não pertence ao usuário');
      }

      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30);

      await prismaClient.carrinho.update({
        where: { id: carrinhoId },
        data: {
          itens: JSON.stringify([]),
          data_expiracao: dataExpiracao
        }
      });

      return {
        itens: [],
        subtotal: 0,
        taxa_entrega: 0,
        desconto: 0,
        total: 0
      };
    } catch (error) {
      console.error('Error in CarrinhoService.esvaziarCarrinho:', error);
      throw error;
    }
  }

  private async calcularResumo(userId: string, itens: any[]) {
    let subtotal = 0;
    let restauranteId: string | null = null;

    // Busca detalhes dos produtos
    const itensDetalhados = await Promise.all(
      itens.map(async (item) => {
        const produto = await prismaClient.produtos.findUnique({
          where: { id: item.produtoId },
          include: {
            restaurantes: true
          }
        });

        if (!produto) return null;

        if (!restauranteId) {
          restauranteId = produto.id_restaurante;
        } else if (restauranteId !== produto.id_restaurante) {
          throw new Error('Não é possível adicionar produtos de restaurantes diferentes');
        }

        // Calcula preço com opções
        let precoItem = produto.preco;
        if (item.opcoes && item.opcoes.length > 0) {
          const opcoes = await prismaClient.opcoesProduto.findMany({
            where: {
              id: { in: item.opcoes }
            }
          });
          precoItem += opcoes.reduce((sum, op) => sum + op.preco, 0);
        }

        const subtotalItem = precoItem * item.quantidade;
        subtotal += subtotalItem;

        return {
          ...item,
          produto: {
            id: produto.id,
            name_produto: produto.name_produto,
            preco: produto.preco,
            imagem: produto.imagem
          },
          preco_unitario: precoItem,
          subtotal: subtotalItem
        };
      })
    );

    const itensValidos = itensDetalhados.filter(i => i !== null);

    // Busca taxa de entrega do restaurante
    let taxaEntrega = 0;
    if (restauranteId) {
      const restaurante = await prismaClient.restaurantes.findUnique({
        where: { id: restauranteId }
      });
      taxaEntrega = restaurante?.taxa_entrega || 0;
    }

    const total = subtotal + taxaEntrega;

    return {
      itens: itensValidos,
      subtotal,
      taxa_entrega: taxaEntrega,
      desconto: 0, // Será calculado quando aplicar cupom
      total
    };
  }
}

export default CarrinhoService;















