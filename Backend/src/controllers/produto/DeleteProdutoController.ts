import { Request, Response } from 'express';
import DeleteProdutoService from '../../services/produto/DeleteProdutoService';

class DeleteProdutoController {
  async deleteProduto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const produtoService = new DeleteProdutoService();
      await produtoService.deleteProduto(id);

      res.status(204).send();
    } catch (error: any) {
      console.error('Error in deleteProduto:', error);
      res.status(404).json({ error: error.message || 'Produto não encontrado' });
    }
  }
}

export default DeleteProdutoController;















