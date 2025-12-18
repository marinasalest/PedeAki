import prismaClient from '../../prisma';

class DeleteRestauranteService {
  async deleteRestauranteById(restauranteId: string): Promise<void> {
    try {
      // Verifica se o restaurante existe antes de deletar
      const restauranteExiste = await prismaClient.restaurantes.findUnique({
        where: { id: restauranteId },
      });

      if (!restauranteExiste) {
        throw new Error('Restaurante não encontrado');
      }

      // Deleta o restaurante
      await prismaClient.restaurantes.delete({
        where: { id: restauranteId },
      });
    } catch (error: any) {
      console.error('Error in deleteRestauranteById:', error);
      
      // Se for erro do Prisma de registro não encontrado, lança erro específico
      if (error.code === 'P2025') {
        throw new Error('Restaurante não encontrado');
      }
      
      throw new Error(error.message || 'Erro ao excluir restaurante.');
    }
  }
}

export default DeleteRestauranteService;

