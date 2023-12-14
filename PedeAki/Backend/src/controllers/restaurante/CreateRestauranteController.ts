// src/controllers/restaurante/RestauranteController.ts
import { Request, Response } from 'express';
import CreateRestauranteService from '../../services/restaurante/CreateRestauranteService';

class RestauranteController {
  async createRestaurante(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        email,
        avaliacao,
        enderecoId,
      } = req.body;

      const restauranteService = new CreateRestauranteService();
      const restaurante = await restauranteService.createRestaurante({
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        email,
        avaliacao,
        enderecoId,
      });

      res.status(201).json({ restaurante });
    } catch (error) {
      console.error('Error in createRestaurante:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default RestauranteController;
