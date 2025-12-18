import { Request, Response } from 'express';
import CarrinhoService from '../../services/carrinho/CarrinhoService';

class CarrinhoController {
  async adicionarItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { produtoId, quantidade, observacoes, personalizacoes, opcoes } = req.body;

      const service = new CarrinhoService();
      const carrinho = await service.adicionarItem(userId, {
        produtoId,
        quantidade,
        observacoes,
        personalizacoes,
        opcoes
      });

      res.status(200).json(carrinho);
    } catch (error: any) {
      console.error('Error in CarrinhoController.adicionarItem:', error);
      res.status(400).json({ error: error.message || 'Erro ao adicionar item ao carrinho' });
    }
  }

  async removerItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { itemId } = req.params;

      const service = new CarrinhoService();
      const carrinho = await service.removerItem(userId, itemId);

      res.status(200).json(carrinho);
    } catch (error: any) {
      console.error('Error in CarrinhoController.removerItem:', error);
      res.status(400).json({ error: error.message || 'Erro ao remover item do carrinho' });
    }
  }

  async atualizarQuantidade(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { itemId } = req.params;
      const { quantidade } = req.body;

      const service = new CarrinhoService();
      const carrinho = await service.atualizarQuantidade(userId, itemId, quantidade);

      res.status(200).json(carrinho);
    } catch (error: any) {
      console.error('Error in CarrinhoController.atualizarQuantidade:', error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar quantidade' });
    }
  }

  async obterCarrinho(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const service = new CarrinhoService();
      const carrinho = await service.obterCarrinho(userId);

      res.status(200).json(carrinho);
    } catch (error: any) {
      console.error('Error in CarrinhoController.obterCarrinho:', error);
      res.status(500).json({ error: error.message || 'Erro ao buscar carrinho' });
    }
  }

  async atualizarCarrinho(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { itens } = req.body;

      if (!itens || !Array.isArray(itens)) {
        res.status(400).json({ error: 'Campo "itens" é obrigatório e deve ser um array' });
        return;
      }

      const service = new CarrinhoService();
      const carrinho = await service.atualizarCarrinho(id, userId, itens);

      res.status(200).json(carrinho);
    } catch (error: any) {
      console.error('Error in CarrinhoController.atualizarCarrinho:', error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar carrinho' });
    }
  }

  async esvaziarCarrinho(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const service = new CarrinhoService();
      const carrinho = await service.esvaziarCarrinho(id, userId);

      res.status(200).json(carrinho);
    } catch (error: any) {
      console.error('Error in CarrinhoController.esvaziarCarrinho:', error);
      res.status(400).json({ error: error.message || 'Erro ao esvaziar carrinho' });
    }
  }
}

export default CarrinhoController;















