import { Request, Response } from 'express';
import ReadCategoriaService from '../../services/categoria/ReadCategoriaService';

class ReadCategoriaController {
  async getCategoriaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const categoriaService = new ReadCategoriaService();
      const categoria = await categoriaService.getCategoriaById(id);

      res.status(200).json({ categoria });
    } catch (error: any) {
      console.error('Error in getCategoriaById:', error);
      res.status(404).json({ error: error.message || 'Categoria não encontrada' });
    }
  }
}

export default ReadCategoriaController;















