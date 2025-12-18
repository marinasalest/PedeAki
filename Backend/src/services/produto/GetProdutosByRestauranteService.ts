import prismaClient from '../../prisma';

class GetProdutosByRestauranteService {
  async getProdutosByRestaurante(restauranteId: string): Promise<any> {
    try {
      const produtos = await prismaClient.produtos.findMany({
        where: { id_restaurante: restauranteId },
        include: {
          restaurantes: true,
          categorias: true,
        },
      });

      return produtos;
    } catch (error) {
      console.error('Error in getProdutosByRestaurante:', error);
      throw new Error('Erro ao obter produtos por restaurante.');
    }
  }
}

export default GetProdutosByRestauranteService;















