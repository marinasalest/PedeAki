import { Request, Response } from 'express';
import PagamentoService from '../../services/pagamento/PagamentoService';

class PagamentoController {
  async processar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId, formaPagamento, dadosPagamento } = req.body;

      const service = new PagamentoService();
      const pagamento = await service.processarPagamento(
        pedidoId,
        userId,
        formaPagamento,
        dadosPagamento
      );

      res.status(200).json({
        message: 'Pagamento processado com sucesso',
        pagamento
      });
    } catch (error: any) {
      console.error('Error in PagamentoController.processar:', error);
      res.status(400).json({ error: error.message || 'Erro ao processar pagamento' });
    }
  }
}

export default PagamentoController;















