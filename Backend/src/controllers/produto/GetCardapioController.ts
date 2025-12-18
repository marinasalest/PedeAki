import { Request, Response } from 'express';
import GetCardapioService from '../../services/produto/GetCardapioService';

class GetCardapioController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { restauranteId } = req.params;
      const { enderecoId } = req.query;

      console.log('=== GET CARDAPIO ===');
      console.log('restauranteId recebido:', restauranteId);
      console.log('Tipo do restauranteId:', typeof restauranteId);
      console.log('enderecoId recebido:', enderecoId);
      console.log('req.params completo:', JSON.stringify(req.params, null, 2));
      console.log('req.url:', req.url);
      console.log('req.path:', req.path);

      if (!restauranteId) {
        res.status(400).json({ error: 'restauranteId é obrigatório' });
        return;
      }

      // Verifica se o parâmetro está sendo recebido literalmente (problema comum no Swagger)
      if (restauranteId.startsWith(':') || restauranteId === 'restauranteId') {
        res.status(400).json({ 
          error: 'ID do restaurante inválido. No Swagger, clique em "Try it out" e substitua {restauranteId} pelo ID real do restaurante (ex: 4ea5aa18-1ead-49bf-8313-3770fe6b72ca). Não use o texto literal ":restauranteId" ou "{restauranteId}" na URL.',
          exemplo: 'URL correta: /cardapio/4ea5aa18-1ead-49bf-8313-3770fe6b72ca',
          url_incorreta: '/cardapio/:restauranteId ou /cardapio/{restauranteId}'
        });
        return;
      }

      // Validação básica de UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(restauranteId)) {
        console.log('ID inválido - não corresponde ao formato UUID');
        res.status(400).json({ error: 'ID do restaurante inválido. Deve ser um UUID válido. Exemplo: 4ea5aa18-1ead-49bf-8313-3770fe6b72ca' });
        return;
      }

      const service = new GetCardapioService();
      const cardapio = await service.execute(restauranteId, enderecoId as string);

      res.status(200).json(cardapio);
    } catch (error: any) {
      console.error('Error in GetCardapioController:', error);
      
      if (error.message === 'Restaurante não encontrado' || error.message?.includes('não encontrado')) {
        res.status(404).json({ error: 'Restaurante não encontrado' });
        return;
      }
      
      if (error.message === 'Restaurante inativo') {
        res.status(400).json({ error: 'Restaurante inativo' });
        return;
      }
      
      res.status(400).json({ error: error.message || 'Erro ao buscar cardápio' });
    }
  }
}

export default GetCardapioController;















