import { Request, Response } from 'express';
import GetRestaurantesByEnderecoService from '../../services/restaurante/GetRestaurantesByEnderecoService';

class GetRestaurantesByEnderecoController {
  async getRestaurantesByEndereco(req: Request, res: Response): Promise<void> {
    try {
      const { enderecoId } = req.params;

      const restauranteService = new GetRestaurantesByEnderecoService();
      const restaurantes = await restauranteService.getRestaurantesByEndereco(enderecoId);

      res.status(200).json({ restaurantes });
    } catch (error: any) {
      console.error('Error in getRestaurantesByEndereco:', error);
      res.status(500).json({ error: error.message || 'Erro ao obter restaurantes por endereço' });
    }
  }
}

export default GetRestaurantesByEnderecoController;















