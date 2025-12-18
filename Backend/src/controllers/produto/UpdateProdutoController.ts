import { Request, Response } from 'express';
import UpdateProdutoService from '../../services/produto/UpdateProdutoService';

class UpdateProdutoController {
  async updateProduto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name_produto,
        preco,
        descricao,
        restauranteId,
        categoriaId,
      } = req.body;

      // Se houver upload de imagem, usar o filename
      const imagem = req.file ? req.file.filename : undefined;

      const produtoService = new UpdateProdutoService();
      const produto = await produtoService.updateProduto(id, {
        name_produto,
        preco,
        imagem,
        descricao,
        restauranteId,
        categoriaId,
      });

      res.status(200).json({ produto });
    } catch (error: any) {
      console.error('Error in updateProduto:', error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar produto' });
    }
  }
}

export default UpdateProdutoController;















