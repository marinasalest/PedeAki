import { Request, Response } from 'express';
import CreateCategoriaService from '../../services/categoria/CreateCategoriaService';

class CreateCategoriaController {
  async createCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { id, name } = req.body;
      const categoriaService = new CreateCategoriaService();

      const categoria = await categoriaService.createCategoria({ id, name });

      res.status(201).json({ categoria });
    } catch (error) {
      console.error('Error in createCategoria:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CreateCategoriaController;
