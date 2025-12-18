import { Request, Response } from 'express';
import ReadProdutoService from '../../services/produto/ReadProdutoService';

class ReadProdutoController {
  async getProdutoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const produtoService = new ReadProdutoService();
      const produto = await produtoService.getProdutoById(id);

      res.status(200).json({ produto });
    } catch (error: any) {
      console.error('Error in getProdutoById:', error);
      res.status(404).json({ error: error.message || 'Produto não encontrado' });
    }
  }
}

export default ReadProdutoController;















