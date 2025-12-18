import { Request, Response } from 'express';
import UsuarioService from '../../services/usuario/UsuarioService';

class UsuarioController {
  async getUsuarioById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validação básica do UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const readUsuarioService = new UsuarioService();
      const usuario = await readUsuarioService.getUsuarioById(id);

      res.status(200).json({ usuario });
    } catch (error: any) {
      console.error('Erro em getUsuarioById:', error);
      console.error('Stack:', error.stack);
      
      // Se o erro for "Usuário não encontrado", retorna 404
      if (error.message === 'Usuário não encontrado' || error.message?.includes('não encontrado')) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      
      // Caso contrário, retorna erro 500 com mensagem específica
      res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  }

  async getAllUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarioService = new UsuarioService();
      const usuarios = await usuarioService.getAllUsuarios();

      res.status(200).json({ usuarios });
    } catch (error) {
      console.error('Erro em getAllUsuarios:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default UsuarioController;


