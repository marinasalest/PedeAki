import prismaClient from '../../prisma';

class RestauranteService {
  async getAllRestaurantes() {
    try {
      const restaurantes = await prismaClient.restaurantes.findMany();
      return restaurantes;
    } catch (error) {
      console.error('Error in getAllRestaurantes:', error);
      throw new Error('Erro ao obter todos os restaurantes.');
    }
  }
}

export default RestauranteService;
