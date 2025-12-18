import prismaClient from '../../prisma';
import { isProdutoDisponivel } from '../../utils/calculations';

class GetCardapioService {
  async execute(restauranteId: string, enderecoId?: string) {
    try {
      console.log('GetCardapioService - Buscando restaurante com ID:', restauranteId);
      
      // Verifica se o restaurante existe e está aberto
      const restaurante = await prismaClient.restaurantes.findUnique({
        where: { id: restauranteId },
        include: {
          enderecos: true
        }
      });

      console.log('GetCardapioService - Restaurante encontrado:', restaurante ? restaurante.id : 'null');

      if (!restaurante) {
        throw new Error('Restaurante não encontrado');
      }

      if (!restaurante.ativo) {
        throw new Error('Restaurante inativo');
      }

      // Verifica se atende o endereço (se fornecido)
      if (enderecoId) {
        const endereco = await prismaClient.enderecos.findUnique({
          where: { id: enderecoId }
        });

        if (endereco) {
          // Verifica CEP
          if (restaurante.ceps_atendidos) {
            const cepsArray = restaurante.ceps_atendidos.split(',').map(c => c.trim());
            if (!cepsArray.includes(endereco.cep)) {
              throw new Error('Restaurante não atende este CEP');
            }
          }

          // Verifica distância
          if (restaurante.enderecos.latitude && restaurante.enderecos.longitude &&
              endereco.latitude && endereco.longitude) {
            const { calculateDistance } = await import('../../utils/calculations');
            const distancia = calculateDistance(
              restaurante.enderecos.latitude,
              restaurante.enderecos.longitude,
              endereco.latitude,
              endereco.longitude
            );
            if (distancia > (restaurante.raio_entrega || 10)) {
              throw new Error('Restaurante fora do raio de entrega');
            }
          }
        }
      }

      // Busca produtos agrupados por categoria
      const produtos = await prismaClient.produtos.findMany({
        where: {
          id_restaurante: restauranteId,
          ativo: true
        },
        include: {
          categorias: true,
          opcoesProduto: {
            where: {
              // Opções ativas
            }
          }
        },
        orderBy: {
          name_produto: 'asc'
        }
      });

      // Filtra produtos disponíveis
      const produtosDisponiveis = produtos.filter(produto =>
        isProdutoDisponivel(
          produto.horario_inicio,
          produto.horario_fim,
          produto.disponivel,
          produto.estoque
        )
      );

      // Agrupa por categoria
      const cardapioPorCategoria: any = {};
      produtosDisponiveis.forEach(produto => {
        const categoriaId = produto.id_categoria;
        if (!cardapioPorCategoria[categoriaId]) {
          cardapioPorCategoria[categoriaId] = {
            categoria: produto.categorias,
            produtos: []
          };
        }

        cardapioPorCategoria[categoriaId].produtos.push({
          id: produto.id,
          name_produto: produto.name_produto,
          preco: produto.preco,
          imagem: produto.imagem,
          descricao: produto.descricao,
          ingredientes: produto.ingredientes,
          alergenicos: produto.alergenicos,
          tempo_preparo: produto.tempo_preparo,
          estoque: produto.estoque,
          quantidade_maxima_pedido: produto.quantidade_maxima_pedido,
          permite_personalizacao: produto.permite_personalizacao,
          disponivel: produto.estoque === null || produto.estoque > 0,
          opcoes: produto.opcoesProduto.map(opcao => ({
            id: opcao.id,
            nome: opcao.nome,
            tipo: opcao.tipo,
            preco: opcao.preco,
            obrigatorio: opcao.obrigatorio
          }))
        });
      });

      return {
        restaurante: {
          id: restaurante.id,
          name: restaurante.name,
          nome_fantasia: restaurante.nome_fantasia,
          foto: restaurante.foto,
          avaliacao: restaurante.avaliacao,
          taxa_entrega: restaurante.taxa_entrega,
          tempo_medio_preparo: restaurante.tempo_medio_preparo,
          valor_minimo_pedido: restaurante.valor_minimo_pedido
        },
        cardapio: Object.values(cardapioPorCategoria)
      };
    } catch (error) {
      console.error('Error in GetCardapioService:', error);
      throw error;
    }
  }
}

export default GetCardapioService;















