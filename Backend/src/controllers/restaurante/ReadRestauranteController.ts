import { Request, Response } from 'express';
import ReadRestauranteService from '../../services/restaurante/ReadRestauranteService';

class ReadRestauranteController {
  async getRestauranteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const restauranteService = new ReadRestauranteService();
      const restaurante = await restauranteService.getRestauranteById(id);

      res.status(200).json({ restaurante });
    } catch (error: any) {
      console.error('Error in getRestauranteById:', error);
      res.status(404).json({ error: error.message || 'Restaurante não encontrado' });
    }
  }
}

export default ReadRestauranteController;















