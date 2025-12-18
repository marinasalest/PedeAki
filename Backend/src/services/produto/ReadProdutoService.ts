import prismaClient from '../../prisma';

class ReadProdutoService {
  async getProdutoById(id: string): Promise<any> {
    try {
      const produto = await prismaClient.produtos.findUnique({
        where: { id },
        include: {
          restaurantes: true,
          categorias: true,
        },
      });

      if (!produto) {
        throw new Error('Produto não encontrado.');
      }

      return produto;
    } catch (error) {
      console.error('Error in getProdutoById:', error);
      throw error;
    }
  }
}

export default ReadProdutoService;















