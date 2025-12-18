import { Request, Response } from 'express';
import AcompanhamentoPedidoService from '../../services/pedido/AcompanhamentoPedidoService';

class AcompanhamentoPedidoController {
  async obterPedido(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId } = req.params;

      console.log('=== OBTER PEDIDO ===');
      console.log('pedidoId recebido:', pedidoId);
      console.log('userId:', userId);

      // Validação de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(pedidoId)) {
        return res.status(400).json({ error: 'ID do pedido inválido. Deve ser um UUID válido.' });
      }

      const service = new AcompanhamentoPedidoService();
      const pedido = await service.obterPedido(pedidoId, userId);

      res.status(200).json({ pedido });
    } catch (error: any) {
      console.error('Error in AcompanhamentoPedidoController.obterPedido:', error);
      if (error.message === 'Pedido não encontrado' || error.message?.includes('não encontrado')) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      if (error.message === 'Pedido não pertence a este usuário' || error.message?.includes('não pertence')) {
        return res.status(403).json({ error: 'Pedido não pertence a este usuário' });
      }
      res.status(400).json({ error: error.message || 'Erro ao buscar pedido' });
    }
  }

  async atualizarStatus(req: Request, res: Response): Promise<void> {
    try {
      const { pedidoId } = req.params;
      const { status } = req.body;
      const userId = req.userId;

      // Valida que apenas o campo status foi enviado
      const camposPermitidos = ['status'];
      const camposEnviados = Object.keys(req.body);
      const camposInvalidos = camposEnviados.filter(campo => !camposPermitidos.includes(campo));
      
      if (camposInvalidos.length > 0) {
        res.status(400).json({ 
          error: `Apenas o campo 'status' é permitido. Campos inválidos: ${camposInvalidos.join(', ')}` 
        });
        return;
      }

      if (!status) {
        res.status(400).json({ error: 'Campo "status" é obrigatório' });
        return;
      }

      // Status permitidos conforme solicitado
      const statusPermitidos = ['CANCELADO', 'PREPARANDO', 'EM_ROTA', 'ENTREGUE'];
      if (!statusPermitidos.includes(status)) {
        res.status(400).json({ 
          error: `Status inválido. Status permitidos: ${statusPermitidos.join(', ')}` 
        });
        return;
      }

      const service = new AcompanhamentoPedidoService();
      const resultado = await service.atualizarStatus(
        pedidoId,
        status,
        undefined, // observacoes não é necessário para esses status
        false,
        userId
      );

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in AcompanhamentoPedidoController.atualizarStatus:', error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar status' });
    }
  }

  async cancelarPedido(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId } = req.params;
      const { motivo } = req.body;

      const service = new AcompanhamentoPedidoService();
      const resultado = await service.cancelarPedido(pedidoId, userId, motivo);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in AcompanhamentoPedidoController.cancelarPedido:', error);
      res.status(400).json({ error: error.message || 'Erro ao cancelar pedido' });
    }
  }

  async recusarPedido(req: Request, res: Response): Promise<void> {
    try {
      const restauranteId = req.restauranteId || req.userId!; // Assumindo que restaurante tem auth
      const { pedidoId } = req.params;
      const { motivo } = req.body;

      if (!motivo) {
        return res.status(400).json({ error: 'Motivo da recusa é obrigatório' });
      }

      const service = new AcompanhamentoPedidoService();
      const resultado = await service.recusarPedido(pedidoId, restauranteId, motivo);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in AcompanhamentoPedidoController.recusarPedido:', error);
      res.status(400).json({ error: error.message || 'Erro ao recusar pedido' });
    }
  }

  async alterarEndereco(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId } = req.params;
      const { novoEnderecoId } = req.body;

      if (!novoEnderecoId) {
        return res.status(400).json({ error: 'ID do novo endereço é obrigatório' });
      }

      const service = new AcompanhamentoPedidoService();
      const resultado = await service.alterarEndereco(pedidoId, userId, novoEnderecoId);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in AcompanhamentoPedidoController.alterarEndereco:', error);
      res.status(400).json({ error: error.message || 'Erro ao alterar endereço' });
    }
  }

  async atualizarItemPedido(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { pedidoId, itemId } = req.params;
      const { quantidade, observacoes, personalizacoes } = req.body;

      const service = new AcompanhamentoPedidoService();
      const resultado = await service.atualizarItemPedido(
        pedidoId,
        itemId,
        userId,
        { quantidade, observacoes, personalizacoes }
      );

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in AcompanhamentoPedidoController.atualizarItemPedido:', error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar item do pedido' });
    }
  }
}

export default AcompanhamentoPedidoController;



