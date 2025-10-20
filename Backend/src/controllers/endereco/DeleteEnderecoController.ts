import { Request, Response } from "express";   
import DeleteEnderecoService from "../../services/endereco/DeleteEnderecoService";

class DeleteEnderecoController {
    async deleteEndereco(req: Request, res: Response): Promise<void> {
        try {
          const { id } = req.params;
    
          const deleteEnderecoService = new DeleteEnderecoService();
          await deleteEnderecoService.deleteEndereco(id);
    
          res.status(204).send();
        } catch (error) {
          console.error('Error in deleteEndereco:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default DeleteEnderecoController;