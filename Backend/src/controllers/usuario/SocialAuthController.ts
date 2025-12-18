import { Request, Response } from 'express';
import SocialAuthService from '../../services/usuario/SocialAuthService';

class SocialAuthController {
  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;

      if (!user) {
        return res.status(401).json({ error: 'Falha na autenticação social' });
      }

      const socialAuthService = new SocialAuthService();
      const token = await socialAuthService.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider || 'local'
      });

      // Redireciona para o frontend com o token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }))}`);
    } catch (error: any) {
      console.error('Error in SocialAuthController:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  }

  async getAuthUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const socialAuthService = new SocialAuthService();
      const user = await socialAuthService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json({ user });
    } catch (error: any) {
      console.error('Error in getAuthUser:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async loginWithFacebook(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const socialAuthService = new SocialAuthService();
      const result = await socialAuthService.loginWithFacebook(email);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in loginWithFacebook:', error);
      res.status(401).json({ error: error.message || 'Erro ao fazer login com Facebook' });
    }
  }

  async loginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const socialAuthService = new SocialAuthService();
      const result = await socialAuthService.loginWithGoogle(email);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in loginWithGoogle:', error);
      res.status(401).json({ error: error.message || 'Erro ao fazer login com Google' });
    }
  }
}

export default SocialAuthController;















