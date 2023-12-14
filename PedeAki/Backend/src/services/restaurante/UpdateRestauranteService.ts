import prismaClient from '../../prisma';

interface UpdateRestauranteRequest {
  id: string;
  name: string;
  cnpj: string;
  nome_fantasia: string;
  senha: string;
  telefone: string;
  avaliacao: string;
  id_endereco: string;
}

class UpdateRestauranteService {
  async updateRestaurante({
    id,
    name,
    cnpj,
    nome_fantasia,
    senha,
    telefone,
    avaliacao,
    id_endereco,
  }: UpdateRestauranteRequest): Promise<any> {
    try {
      const restaurante = await prismaClient.restaurantes.update({
        where: { id },
        data: {
          name,
          cnpj,
          nome_fantasia,
          senha,
          telefone,
          avaliacao,
          id_endereco,
        },
      });

      return restaurante;
    } catch (error) {
      console.error('Error in updateRestaurante:', error);
      throw new Error('Erro ao atualizar o restaurante.');
    }
  }
}

export default UpdateRestauranteService;
