import { Request, Response } from 'express';
import UsuarioService from '../../services/usuario/UsuarioService';

class UsuarioController {
  async getUsuarioById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const readUsuarioService = new UsuarioService();
      const usuario = await readUsuarioService.getUsuarioById(id);

      res.status(200).json({ usuario });
    } catch (error) {
      console.error('Erro em getUsuarioById:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default UsuarioController;
