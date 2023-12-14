import prismaClient from '../../prisma';

interface CategoriaRequest {
  id: string;
  name: string;
}

class UpdateCategoriaService {
  async updateCategoria({ id, name }: CategoriaRequest): Promise<void> {
    try {
      await prismaClient.categorias.update({
        where: { id },
        data: { name },
      });
    } catch (error) {
      console.error('Error in updateCategoria:', error);
      throw new Error('Erro ao atualizar a categoria.');
    }
  }
}

export default UpdateCategoriaService;
