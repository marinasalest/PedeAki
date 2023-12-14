import { Request, Response } from 'express';
import DeleteCategoriaService from '../../services/categoria/DeleteCategoriaService';

class DeleteCategoriaController {
  async deleteCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteCategoriaService = new DeleteCategoriaService();
      await deleteCategoriaService.deleteCategoria(id);

      res.status(200).json({ message: 'Categoria excluída com sucesso.' });
    } catch (error) {
      console.error('Error in deleteCategoria:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default DeleteCategoriaController;
