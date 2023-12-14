import prismaClient from '../../prisma';

interface ProdutoRequest {
  name_produto: string;
  preco: number;
  imagem: string;
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
      const produto = await prismaClient.produtos.create({
        data: {
          name_produto,
          preco: Number(preco),
          imagem,
          descricao,
          restaurantes: { connect: { id: restauranteId } }, // Usando connect para relacionar com o restaurante
          categorias: { connect: { id: categoriaId } }, // Usando connect para relacionar com a categoria
        },
      });

      return produto;
    } catch (error) {
      console.error('Error in createProduto:', error);
      throw new Error('Erro ao criar o produto.');
    }
  }
}

export default CreateProdutoService;
