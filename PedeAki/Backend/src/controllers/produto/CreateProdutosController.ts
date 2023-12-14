import { Request, Response } from 'express';
import CreateProdutosService from '../../services/produto/CreateProdutosService';

class CreateProdutoController {
  async createProduto(req: Request, res: Response): Promise<void> {
    try {
      const {
        name_produto,
        preco,
        descricao,
        restauranteId,
        categoriaId,
      } = req.body;

      const produtoService = new CreateProdutosService();
      if(!req.file) {
        throw new Error('Imagem não encontrada')
      } else {
        const { originalname, filename } = req.file;
        console.log(filename);

        const produto = await produtoService.createProduto({
          name_produto,
          preco,
          imagem: filename,
          descricao,
          restauranteId,
          categoriaId,
        });

        res.status(201).json(produto);
      }
      const produto = await produtoService.createProduto({
        name_produto,
        preco,
        imagem: __filename,
        descricao,
        restauranteId,
        categoriaId,
      });

      res.status(201).json({ produto: produto });
    } catch (error) {
      console.error('Error in createProduto:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CreateProdutoController;
