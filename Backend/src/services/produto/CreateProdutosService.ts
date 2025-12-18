import prismaClient from '../../prisma';

interface ProdutoRequest {
  name_produto: string;
  preco: number;
  imagem: string | null; // Imagem é opcional
  descricao: string;
  restauranteId: string; // Renomeado de id_restaurante para restauranteId
  categoriaId: string; // Renomeado de id_categoria para categoriaId
}

class CreateProdutoService {
  async createProduto({
    name_produto,
    preco,
    imagem,
    descricao,
    restauranteId,
    categoriaId,
  }: ProdutoRequest): Promise<any> {
    try {
      // Valida se o restaurante existe
      const restauranteExiste = await prismaClient.restaurantes.findUnique({
        where: { id: restauranteId }
      });

      if (!restauranteExiste) {
        throw new Error('Restaurante não encontrado');
      }

      // Valida se a categoria existe
      const categoriaExiste = await prismaClient.categorias.findUnique({
        where: { id: categoriaId }
      });

      if (!categoriaExiste) {
        throw new Error('Categoria não encontrada');
      }

      const produto = await prismaClient.produtos.create({
        data: {
          name_produto,
          preco: Number(preco),
          imagem: imagem || null, // Permite null se não houver imagem
          descricao: descricao || null,
          id_restaurante: restauranteId, // Usa o campo direto do schema
          id_categoria: categoriaId, // Usa o campo direto do schema
        },
      });

      return produto;
    } catch (error: any) {
      console.error('Error in createProduto:', error);
      throw new Error(error.message || 'Erro ao criar o produto.');
    }
  }
}

export default CreateProdutoService;
