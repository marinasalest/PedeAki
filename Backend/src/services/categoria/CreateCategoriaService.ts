import prismaClient from '../../prisma';

interface CategoriaRequest {
  id: string;
  name: string;
}

class CreateCategoriaService {
  async createCategoria({ id, name }: CategoriaRequest): Promise<any> {
    try {
      const categoria = await prismaClient.categorias.create({
        data: {
          id,
          name,
        },
      });

      return categoria;
    } catch (error) {
      console.error('Error in createCategoria:', error);
      throw new Error('Erro ao criar categoria.');
    }
  }
}

export default CreateCategoriaService;
