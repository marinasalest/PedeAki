import { Request, Response } from 'express';
import CreateProdutosService from '../../services/produto/CreateProdutosService';

class CreateProdutoController {
  async createProduto(req: Request, res: Response): Promise<void> {
    try {
      const {
        name_produto,
        preco,
        imagem,
        descricao,
        restauranteId,
        categoriaId,
      } = req.body;

      const produtoService = new CreateProdutosService();
      const produto = await produtoService.createProduto({
        name_produto,
        preco,
        imagem,
        descricao,
        restauranteId,
        categoriaId,
      });

      res.status(201).json({ produto });
    } catch (error) {
      console.error('Error in createProduto:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CreateProdutoController;
