import { Request, Response } from 'express';
import CreateProdutosService from '../../services/produto/CreateProdutosService';

class CreateProdutoController {
  async createProduto(req: Request, res: Response): Promise<void> {
    try {
      const {
        name_produto,
        preco,
        descricao,
        restauranteId,
        id_restaurante, // Aceita ambos os nomes
        categoriaId,
        id_categoria, // Aceita ambos os nomes
      } = req.body;

      // Usa restauranteId ou id_restaurante (qualquer um que vier)
      const restauranteIdFinal = restauranteId || id_restaurante;
      // Usa categoriaId ou id_categoria (qualquer um que vier)
      const categoriaIdFinal = categoriaId || id_categoria;

      if (!restauranteIdFinal) {
        res.status(400).json({ error: 'restauranteId ou id_restaurante é obrigatório' });
        return;
      }

      if (!categoriaIdFinal) {
        res.status(400).json({ error: 'categoriaId ou id_categoria é obrigatório' });
        return;
      }

      // Imagem é opcional - se não for enviada, será null
      const imagem = req.file ? req.file.filename : null;

      const produtoService = new CreateProdutosService();
      const produto = await produtoService.createProduto({
        name_produto,
        preco,
        imagem,
        descricao,
        restauranteId: restauranteIdFinal,
        categoriaId: categoriaIdFinal,
      });

      res.status(201).json({ produto });
    } catch (error: any) {
      console.error('Error in createProduto:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
}

export default CreateProdutoController;
