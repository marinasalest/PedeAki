import { Request, Response } from 'express';
import NotaFiscalService from '../../services/pedido/NotaFiscalService';

class NotaFiscalController {
  async gerarNotaFiscal(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId } = req.params;

      const service = new NotaFiscalService();
      const notaFiscal = await service.gerarNotaFiscal(pedidoId, userId);

      res.status(200).json({
        message: 'Nota Fiscal gerada com sucesso',
        notaFiscal
      });
    } catch (error: any) {
      console.error('Error in NotaFiscalController.gerarNotaFiscal:', error);
      res.status(400).json({ error: error.message || 'Erro ao gerar nota fiscal' });
    }
  }
}

export default NotaFiscalController;












