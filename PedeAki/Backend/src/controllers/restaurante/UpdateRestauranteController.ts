import { Request, Response } from 'express';
import UpdateRestauranteService from '../../services/restaurante/UpdateRestauranteService';

class UpdateRestauranteController {
  async updateRestaurante(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        avaliacao,
        id_endereco,
      } = req.body;

      

      const updateRestauranteService = new UpdateRestauranteService();

      const { restauranteId } = req.params;
      const restaurante = await updateRestauranteService.updateRestaurante({
        id: restauranteId,
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        avaliacao,
        id_endereco,
      });

      res.status(200).json(restaurante);
    } catch (error) {
      console.error('Error in updateRestaurante:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UpdateRestauranteController;
