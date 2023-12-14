import { Request, Response } from 'express';
import UpdateCategoriaService from '../../services/categoria/UpdateCategoriaService';

class UpdateCategoriaController {
  async updateCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updateCategoriaService = new UpdateCategoriaService();
      await updateCategoriaService.updateCategoria({ id, name });

      res.status(200).json({ message: 'Categoria atualizada com sucesso.' });
    } catch (error) {
      console.error('Error in updateCategoria:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UpdateCategoriaController;
