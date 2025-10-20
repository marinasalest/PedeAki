import prismaClient from '../../prisma';

interface RestauranteRequest {
  name: string;
  cnpj: string;
  nome_fantasia: string;
  senha: string;
  telefone: string;
  email: string;
  avaliacao: string;
  enderecoId: string;
}

class CreateRestauranteService {
  async createRestaurante({
    name,
    cnpj,
    nome_fantasia,
    senha,
    telefone,
    email,
    avaliacao,
    enderecoId,
  }: RestauranteRequest): Promise<any> {
    try {
      const restaurante = await prismaClient.restaurantes.create({
        data: {
          name,
          cnpj,
          nome_fantasia,
          senha,
          telefone,
          email,
          avaliacao,
          enderecos: { connect: { id: enderecoId } },
        },
      });

      return restaurante;
    } catch (error) {
      console.error('Error in createRestaurante:', error);
      throw new Error('Erro ao criar o restaurante.');
    }
  }
}

export default CreateRestauranteService;
