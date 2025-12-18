import prismaClient from '../../prisma';

class ReadCategoriaService {
  async getCategoriaById(id: string): Promise<any> {
    try {
      const categoria = await prismaClient.categorias.findUnique({
        where: { id },
        include: {
          produtos: true,
        },
      });

      if (!categoria) {
        throw new Error('Categoria não encontrada.');
      }

      return categoria;
    } catch (error) {
      console.error('Error in getCategoriaById:', error);
      throw error;
    }
  }
}

export default ReadCategoriaService;















