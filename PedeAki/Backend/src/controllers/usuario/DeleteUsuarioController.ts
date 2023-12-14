import { Request, Response } from 'express';
import DeleteUsuarioService from '../../services/usuario/DeleteUsuarioService';

class DeleteUsuarioController {
  async deleteUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userService = new DeleteUsuarioService();
      await userService.deleteUserById(id);

      res.status(204).send(); // 204 No Content (indicando sucesso sem conteúdo)
    } catch (error) {
      console.error('Error in deleteUserById:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default DeleteUsuarioController;
