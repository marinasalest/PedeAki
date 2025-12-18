import { Request, Response } from 'express';
import ReadEnderecoByIdService from '../../services/endereco/ReadEnderecoByIdService';

class ReadEnderecoByIdController {
  async getEnderecoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const enderecoService = new ReadEnderecoByIdService();
      const endereco = await enderecoService.getEnderecoById(id);

      res.status(200).json({ endereco });
    } catch (error: any) {
      console.error('Error in getEnderecoById:', error);
      res.status(404).json({ error: error.message || 'Endereço não encontrado' });
    }
  }
}

export default ReadEnderecoByIdController;















