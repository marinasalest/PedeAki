import { Request, Response } from 'express';
import ReadEnderecoService from '../../services/endereco/ReadEnderecoService';

class ReadEnderecoController {
  async getAllEnderecos(req: Request, res: Response): Promise<void> {
    try {
      const readEnderecoService = new ReadEnderecoService();
      const enderecos = await readEnderecoService.getAllEnderecos();

      res.status(200).json({ enderecos });
    } catch (error) {
      console.error('Error in getAllEnderecos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default ReadEnderecoController;
