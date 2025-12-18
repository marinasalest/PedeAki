import prismaClient from '../../prisma';

class ProdutoService {
  async getAllProdutos(): Promise<any> {
    try {
      const produtos = await prismaClient.produtos.findMany({
        include: {
          restaurantes: true,
          categorias: true,
        },
      });
      return produtos;
    } catch (error) {
      console.error('Error in getAllProdutos:', error);
      throw new Error('Erro ao obter todos os produtos.');
    }
  }
}

export default ProdutoService;















