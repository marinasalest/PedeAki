import prismaClient from '../../prisma';

class DeleteProdutoService {
  async deleteProduto(id: string): Promise<void> {
    try {
      // Verifica se o produto existe
      const produtoExists = await prismaClient.produtos.findUnique({
        where: { id },
      });

      if (!produtoExists) {
        throw new Error('Produto não encontrado.');
      }

      await prismaClient.produtos.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error in deleteProduto:', error);
      throw error;
    }
  }
}

export default DeleteProdutoService;















