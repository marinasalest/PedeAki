import { Request, Response } from 'express';
import RecuperarSenhaService from '../../services/usuario/RecuperarSenhaService';

class RecuperarSenhaController {
  async solicitarRecuperacao(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: 'Email é obrigatório'
        });
      }

      const service = new RecuperarSenhaService();
      const resultado = await service.solicitarRecuperacao(email);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in RecuperarSenhaController.solicitarRecuperacao:', error);
      res.status(400).json({ error: error.message || 'Erro ao solicitar recuperação de senha' });
    }
  }

  async redefinirSenha(req: Request, res: Response): Promise<void> {
    try {
      const { email, codigo, novaSenha } = req.body;

      if (!email || !codigo || !novaSenha) {
        return res.status(400).json({
          error: 'Email, código e nova senha são obrigatórios'
        });
      }

      const service = new RecuperarSenhaService();
      const resultado = await service.redefinirSenha(email, codigo, novaSenha);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in RecuperarSenhaController.redefinirSenha:', error);
      res.status(400).json({ error: error.message || 'Erro ao redefinir senha' });
    }
  }
}

export default RecuperarSenhaController;












