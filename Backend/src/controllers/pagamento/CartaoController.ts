import { Request, Response } from 'express';
import CartaoService from '../../services/pagamento/CartaoService';

class CartaoController {
  async salvarCartao(req: Request, res: Response): Promise<void> {
    try {
      // Verifica se o usuário está autenticado
      if (!req.userId) {
        return res.status(401).json({
          error: 'Usuário não autenticado. Token de autenticação é obrigatório.'
        });
      }

      const userId = req.userId;
      const { numeroCartao, nomeTitular, validadeCartao, tipo } = req.body;

      console.log('=== SALVAR CARTÃO ===');
      console.log('userId:', userId);
      console.log('Body recebido:', { numeroCartao: numeroCartao ? '***' : undefined, nomeTitular, validadeCartao, tipo });

      if (!numeroCartao || !nomeTitular || !validadeCartao || !tipo) {
        return res.status(400).json({
          error: 'Todos os campos são obrigatórios: numeroCartao, nomeTitular, validadeCartao, tipo'
        });
      }

      if (!['credito', 'debito'].includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo deve ser "credito" ou "debito"'
        });
      }

      const service = new CartaoService();
      const cartao = await service.salvarCartao(
        userId,
        numeroCartao,
        nomeTitular,
        validadeCartao,
        tipo
      );

      res.status(201).json({ cartao });
    } catch (error: any) {
      console.error('Error in CartaoController.salvarCartao:', error);
      const statusCode = error.message?.includes('não encontrado') ? 404 : 
                        error.message?.includes('inválido') ? 400 : 500;
      res.status(statusCode).json({ error: error.message || 'Erro ao salvar cartão' });
    }
  }

  async listarCartoes(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const service = new CartaoService();
      const cartoes = await service.listarCartoes(userId);

      res.status(200).json({ cartoes });
    } catch (error: any) {
      console.error('Error in CartaoController.listarCartoes:', error);
      res.status(400).json({ error: error.message || 'Erro ao listar cartões' });
    }
  }

  async definirPadrao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { cartaoId } = req.params;

      const service = new CartaoService();
      const resultado = await service.definirPadrao(userId, cartaoId);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in CartaoController.definirPadrao:', error);
      res.status(400).json({ error: error.message || 'Erro ao definir cartão padrão' });
    }
  }

  async removerCartao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { cartaoId } = req.params;

      const service = new CartaoService();
      const resultado = await service.removerCartao(userId, cartaoId);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in CartaoController.removerCartao:', error);
      res.status(400).json({ error: error.message || 'Erro ao remover cartão' });
    }
  }
}

export default CartaoController;












