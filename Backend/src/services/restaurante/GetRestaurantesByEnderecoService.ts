import prismaClient from '../../prisma';

class GetRestaurantesByEnderecoService {
  async getRestaurantesByEndereco(enderecoId: string): Promise<any> {
    try {
      const restaurantes = await prismaClient.restaurantes.findMany({
        where: { id_endereco: enderecoId },
        include: {
          enderecos: true,
          produtos: true,
          avaliacoes: true,
        },
      });

      return restaurantes;
    } catch (error) {
      console.error('Error in getRestaurantesByEndereco:', error);
      throw new Error('Erro ao obter restaurantes por endereço.');
    }
  }
}

export default GetRestaurantesByEnderecoService;















