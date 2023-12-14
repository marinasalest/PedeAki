import prismaClient from '../../prisma';

class ReadEnderecoService {
  async getAllEnderecos(): Promise<any> {
    try {
      const enderecos = await prismaClient.enderecos.findMany();
      return enderecos;
    } catch (error) {
      console.error('Error in getAllEnderecos:', error);
      throw new Error('Erro ao obter todos os endereços.');
    }
  }
}

export default ReadEnderecoService;
