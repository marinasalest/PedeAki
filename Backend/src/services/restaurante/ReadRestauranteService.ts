import prismaClient from '../../prisma';

class ReadRestauranteService {
  async getRestauranteById(id: string): Promise<any> {
    try {
      const restaurante = await prismaClient.restaurantes.findUnique({
        where: { id },
        include: {
          enderecos: true,
          produtos: true,
          pedidos: true,
          avaliacoes: true,
        },
      });

      if (!restaurante) {
        throw new Error('Restaurante não encontrado.');
      }

      return restaurante;
    } catch (error) {
      console.error('Error in getRestauranteById:', error);
      throw error;
    }
  }
}

export default ReadRestauranteService;















