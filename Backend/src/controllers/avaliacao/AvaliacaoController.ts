import { Request, Response } from 'express';
import AvaliacaoService from '../../services/avaliacao/AvaliacaoService';

class AvaliacaoController {
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId, nota, comentario, denuncia } = req.body;

      const service = new AvaliacaoService();
      const avaliacao = await service.criarAvaliacao(
        pedidoId,
        userId,
        nota,
        comentario,
        denuncia
      );

      res.status(201).json({
        message: 'Avaliação criada com sucesso',
        avaliacao
      });
    } catch (error: any) {
      console.error('Error in AvaliacaoController.criar:', error);
      res.status(400).json({ error: error.message || 'Erro ao criar avaliação' });
    }
  }

  async pedirNovamente(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId } = req.params;

      const service = new AvaliacaoService();
      const itens = await service.pedirNovamente(pedidoId, userId);

      res.status(200).json({
        message: 'Itens do pedido recuperados',
        itens
      });
    } catch (error: any) {
      console.error('Error in AvaliacaoController.pedirNovamente:', error);
      res.status(400).json({ error: error.message || 'Erro ao recuperar pedido' });
    }
  }
}

export default AvaliacaoController;















