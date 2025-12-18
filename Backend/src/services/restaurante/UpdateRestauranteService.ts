import prismaClient from '../../prisma';

interface UpdateRestauranteRequest {
  name?: string;
  cnpj?: string;
  nome_fantasia?: string;
  senha?: string;
  telefone?: string;
  email?: string;
  avaliacao?: number | string; // Pode ser número ou string
  enderecoId?: string;
}

class UpdateRestauranteService {
  async updateRestaurante(id: string, data: UpdateRestauranteRequest): Promise<any> {
    try {
      // Verifica se o restaurante existe
      const restauranteExists = await prismaClient.restaurantes.findUnique({
        where: { id },
      });

      if (!restauranteExists) {
        throw new Error('Restaurante não encontrado.');
      }

      // Prepara os dados para atualização
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.cnpj !== undefined) updateData.cnpj = data.cnpj;
      if (data.nome_fantasia !== undefined) updateData.nome_fantasia = data.nome_fantasia;
      if (data.senha !== undefined) updateData.senha = data.senha;
      if (data.telefone !== undefined) updateData.telefone = data.telefone;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.avaliacao !== undefined) updateData.avaliacao = data.avaliacao;
      if (data.enderecoId !== undefined) {
        updateData.enderecos = { connect: { id: data.enderecoId } };
      }

      const restaurante = await prismaClient.restaurantes.update({
        where: { id },
        data: updateData,
      });

      return restaurante;
    } catch (error) {
      console.error('Error in updateRestaurante:', error);
      throw error;
    }
  }
}

export default UpdateRestauranteService;















