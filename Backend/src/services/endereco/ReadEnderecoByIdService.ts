import prismaClient from '../../prisma';

class ReadEnderecoByIdService {
  async getEnderecoById(id: string): Promise<any> {
    try {
      const endereco = await prismaClient.enderecos.findUnique({
        where: { id },
        include: {
          usuarios: true,
          restaurantes: true,
        },
      });

      if (!endereco) {
        throw new Error('Endereço não encontrado.');
      }

      return endereco;
    } catch (error) {
      console.error('Error in getEnderecoById:', error);
      throw error;
    }
  }
}

export default ReadEnderecoByIdService;















