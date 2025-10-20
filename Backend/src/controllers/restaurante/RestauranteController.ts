import { Request, Response } from 'express';
import RestauranteService from '../../services/restaurante/RestauranteService';

class RestauranteController {
  async getAllRestaurantes(req: Request, res: Response): Promise<void> {
    try {
      const restaurantesService = new RestauranteService();
      const restaurantes = await restaurantesService.getAllRestaurantes();

      res.status(200).json({ restaurantes });
    } catch (error) {
      console.error('Error in getAllRestaurantes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default RestauranteController;
