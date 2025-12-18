import { Request, Response } from 'express';
import CreatePedidoService from '../../services/pedido/CreatePedidoService';

class CreatePedidoController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const {
        formaPagamento,
        codigoCupom,
        tipoEntrega
      } = req.body;

      if (!formaPagamento) {
        return res.status(400).json({ error: 'Forma de pagamento é obrigatória' });
      }

      if (!tipoEntrega) {
        return res.status(400).json({ error: 'Tipo de entrega é obrigatório' });
      }

      const service = new CreatePedidoService();
      const resultado = await service.execute(
        userId,
        formaPagamento,
        codigoCupom,
        tipoEntrega
      );

      res.status(201).json({
        message: 'Pedido criado com sucesso',
        pedido: resultado.pedido,
        carrinho: resultado.carrinho,
        cartao: resultado.cartao
      });
    } catch (error: any) {
      console.error('Error in CreatePedidoController:', error);
      res.status(400).json({ error: error.message || 'Erro ao criar pedido' });
    }
  }
}

export default CreatePedidoController;















