import { Request, Response } from 'express';
import UpdateUsuarioService from '../../services/usuario/UpdateUsuarioService';

class UpdateUsuarioController {
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, cpf, data_nascimento, password } = req.body;

      const userService = new UpdateUsuarioService();
      const updateUsuario = await userService.updateUser({
        id,
        name,
        cpf,
        data_nascimento,
        password,
      });

      res.status(200).json({ user: updateUsuario });
    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UpdateUsuarioController;
