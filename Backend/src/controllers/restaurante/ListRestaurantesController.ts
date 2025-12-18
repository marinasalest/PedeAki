import { Request, Response } from 'express';
import ListRestaurantesService from '../../services/restaurante/ListRestaurantesService';

class ListRestaurantesController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const {
        categoriaId,
        avaliacaoMinima,
        precoMin,
        precoMax,
        tempoMaxEntrega,
        tipoEntrega,
        cep,
        latitude,
        longitude
      } = req.query;

      const service = new ListRestaurantesService();
      const restaurantes = await service.execute({
        categoriaId: categoriaId as string,
        avaliacaoMinima: avaliacaoMinima ? Number(avaliacaoMinima) : undefined,
        precoMin: precoMin ? Number(precoMin) : undefined,
        precoMax: precoMax ? Number(precoMax) : undefined,
        tempoMaxEntrega: tempoMaxEntrega ? Number(tempoMaxEntrega) : undefined,
        tipoEntrega: tipoEntrega as string,
        cep: cep as string,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined
      });

      res.status(200).json({ restaurantes });
    } catch (error: any) {
      console.error('Error in ListRestaurantesController:', error);
      res.status(500).json({ error: error.message || 'Erro ao listar restaurantes' });
    }
  }
}

export default ListRestaurantesController;















