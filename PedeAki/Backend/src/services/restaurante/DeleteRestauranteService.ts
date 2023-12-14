import prismaClient from '../../prisma';

class DeleteRestauranteService {
  async deleteRestaurante(id: string): Promise<void> {
    try {
      await prismaClient.restaurantes.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error in deleteRestaurante:', error);
      throw new Error('Erro ao excluir o restaurante.');
    }
  }
}

export default DeleteRestauranteService;
