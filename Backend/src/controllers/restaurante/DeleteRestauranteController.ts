import { Request, Response } from 'express';
import DeleteRestauranteService from '../../services/restaurante/DeleteRestauranteService';

class DeleteRestauranteController {
  async deleteRestaurante(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validação básica de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const restauranteService = new DeleteRestauranteService();
      await restauranteService.deleteRestauranteById(id);

      res.status(204).send(); // 204 No Content (indicando sucesso sem conteúdo)
    } catch (error: any) {
      console.error('Error in deleteRestaurante:', error);
      
      if (error.message === 'Restaurante não encontrado' || error.message?.includes('não encontrado')) {
        res.status(404).json({ error: 'Restaurante não encontrado' });
        return;
      }
      
      res.status(500).json({ error: error.message || 'Erro ao excluir restaurante' });
    }
  }
}

export default DeleteRestauranteController;

