import { Request, Response } from 'express';
import GetProdutosByCategoriaService from '../../services/produto/GetProdutosByCategoriaService';

class GetProdutosByCategoriaController {
  async getProdutosByCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { categoriaId } = req.params;

      const produtoService = new GetProdutosByCategoriaService();
      const produtos = await produtoService.getProdutosByCategoria(categoriaId);

      res.status(200).json({ produtos });
    } catch (error: any) {
      console.error('Error in getProdutosByCategoria:', error);
      res.status(500).json({ error: error.message || 'Erro ao obter produtos por categoria' });
    }
  }
}

export default GetProdutosByCategoriaController;















