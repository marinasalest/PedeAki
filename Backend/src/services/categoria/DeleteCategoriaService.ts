import prismaClient from '../../prisma';

class DeleteCategoriaService {
  async deleteCategoria(id: string): Promise<void> {
    try {
      await prismaClient.categorias.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error in deleteCategoria:', error);
      throw new Error('Erro ao excluir a categoria.');
    }
  }
}

export default DeleteCategoriaService;
