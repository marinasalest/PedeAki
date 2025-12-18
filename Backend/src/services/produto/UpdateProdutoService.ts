import prismaClient from '../../prisma';

interface UpdateProdutoRequest {
  name_produto?: string;
  preco?: number;
  imagem?: string;
  descricao?: string;
  restauranteId?: string;
  categoriaId?: string;
}

class UpdateProdutoService {
  async updateProduto(id: string, data: UpdateProdutoRequest): Promise<any> {
    try {
      // Verifica se o produto existe
      const produtoExists = await prismaClient.produtos.findUnique({
        where: { id },
      });

      if (!produtoExists) {
        throw new Error('Produto não encontrado.');
      }

      // Prepara os dados para atualização
      const updateData: any = {};
      if (data.name_produto !== undefined) updateData.name_produto = data.name_produto;
      if (data.preco !== undefined) updateData.preco = Number(data.preco);
      if (data.imagem !== undefined) updateData.imagem = data.imagem;
      if (data.descricao !== undefined) updateData.descricao = data.descricao;
      if (data.restauranteId !== undefined) {
        updateData.restaurantes = { connect: { id: data.restauranteId } };
      }
      if (data.categoriaId !== undefined) {
        updateData.categorias = { connect: { id: data.categoriaId } };
      }

      const produto = await prismaClient.produtos.update({
        where: { id },
        data: updateData,
        include: {
          restaurantes: true,
          categorias: true,
        },
      });

      return produto;
    } catch (error) {
      console.error('Error in updateProduto:', error);
      throw error;
    }
  }
}

export default UpdateProdutoService;















