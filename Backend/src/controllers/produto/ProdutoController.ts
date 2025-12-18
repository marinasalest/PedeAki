import { Request, Response } from 'express';
import ProdutoService from '../../services/produto/ProdutoService';

class ProdutoController {
  async getAllProdutos(req: Request, res: Response): Promise<void> {
    try {
      const produtoService = new ProdutoService();
      const produtos = await produtoService.getAllProdutos();

      res.status(200).json({ produtos });
    } catch (error) {
      console.error('Error in getAllProdutos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default ProdutoController;















