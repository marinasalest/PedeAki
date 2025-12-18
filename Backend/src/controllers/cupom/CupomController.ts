import { Request, Response } from 'express';
import CupomService from '../../services/cupom/CupomService';

class CupomController {
  async validar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { codigo, restauranteId, valorPedido } = req.body;

      const service = new CupomService();
      const resultado = await service.validarCupom(
        codigo,
        userId,
        restauranteId,
        valorPedido
      );

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in CupomController.validar:', error);
      res.status(400).json({ error: error.message || 'Erro ao validar cupom' });
    }
  }
}

export default CupomController;















