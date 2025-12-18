import { Request, Response } from 'express';
import GetProdutosByRestauranteService from '../../services/produto/GetProdutosByRestauranteService';

class GetProdutosByRestauranteController {
  async getProdutosByRestaurante(req: Request, res: Response): Promise<void> {
    try {
      const { restauranteId } = req.params;

      const produtoService = new GetProdutosByRestauranteService();
      const produtos = await produtoService.getProdutosByRestaurante(restauranteId);

      res.status(200).json({ produtos });
    } catch (error: any) {
      console.error('Error in getProdutosByRestaurante:', error);
      res.status(500).json({ error: error.message || 'Erro ao obter produtos por restaurante' });
    }
  }
}

export default GetProdutosByRestauranteController;















