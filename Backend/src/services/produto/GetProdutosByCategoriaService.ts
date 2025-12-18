import prismaClient from '../../prisma';

class GetProdutosByCategoriaService {
  async getProdutosByCategoria(categoriaId: string): Promise<any> {
    try {
      const produtos = await prismaClient.produtos.findMany({
        where: { id_categoria: categoriaId },
        include: {
          restaurantes: true,
          categorias: true,
        },
      });

      return produtos;
    } catch (error) {
      console.error('Error in getProdutosByCategoria:', error);
      throw new Error('Erro ao obter produtos por categoria.');
    }
  }
}

export default GetProdutosByCategoriaService;















