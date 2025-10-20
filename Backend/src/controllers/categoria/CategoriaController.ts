import { Request, Response } from 'express';
import CategoriaService from '../../services/categoria/CategoriaService';

class CategoriaController {
  async getAllCategorias(req: Request, res: Response): Promise<void> {
    try {
      const categoriaService = new CategoriaService();
      const categorias = await categoriaService.getAllCategorias();

      res.status(200).json({ categorias });
    } catch (error) {
      console.error('Error in getAllCategorias:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CategoriaController;
