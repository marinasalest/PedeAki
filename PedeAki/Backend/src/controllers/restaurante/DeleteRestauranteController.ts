import { Request, Response } from 'express';
import DeleteRestauranteService from '../../services/restaurante/DeleteRestauranteService';

class DeleteRestauranteController {
  async deleteRestaurante(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteRestauranteService = new DeleteRestauranteService();
      await deleteRestauranteService.deleteRestaurante(id);

      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteRestaurante:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default DeleteRestauranteController;

