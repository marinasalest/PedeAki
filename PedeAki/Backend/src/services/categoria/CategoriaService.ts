import prismaClient from '../../prisma';

class CategoriaService {
  async getAllCategorias(): Promise<any> {
    try {
      const categorias = await prismaClient.categorias.findMany();
      return categorias;
    } catch (error) {
      console.error('Error in getAllCategorias:', error);
      throw new Error('Erro ao obter todas as categorias.');
    }
  }
}

export default CategoriaService;
