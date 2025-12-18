import { Request, Response } from 'express';
import UpdateUsuarioService from '../../services/usuario/UpdateUsuarioService';

class UpdateUsuarioController {
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, cpf, data_nascimento, password } = req.body;

      // Converter data_nascimento de string para Date se fornecido
      let dataNascimentoDate: Date | null = null;
      if (data_nascimento) {
        dataNascimentoDate = new Date(data_nascimento);
        // Validar se a data é válida
        if (isNaN(dataNascimentoDate.getTime())) {
          res.status(400).json({ error: 'Data de nascimento inválida' });
          return;
        }
      }

      const userService = new UpdateUsuarioService();
      const updateUsuario = await userService.updateUser({
        id,
        name,
        cpf,
        data_nascimento: dataNascimentoDate,
        password,
      });

      res.status(200).json({ user: updateUsuario });
    } catch (error: any) {
      console.error('Error in updateUser:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
}

export default UpdateUsuarioController;
