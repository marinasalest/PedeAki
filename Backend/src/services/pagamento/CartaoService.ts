import prismaClient from '../../prisma';
import crypto from 'crypto';

class CartaoService {
  // Criptografa número do cartão (salva apenas últimos 4 dígitos)
  private criptografarNumero(numero: string): string {
    // Remove espaços e caracteres não numéricos
    const numeroLimpo = numero.replace(/\D/g, '');
    
    // Salva apenas últimos 4 dígitos
    const ultimos4 = numeroLimpo.slice(-4);
    
    // Criptografa o número completo para comparação futura
    const hash = crypto.createHash('sha256').update(numeroLimpo).digest('hex');
    
    // Retorna hash + últimos 4 dígitos
    return `${hash}:${ultimos4}`;
  }

  // Identifica bandeira do cartão
  private identificarBandeira(numero: string): string {
    const numeroLimpo = numero.replace(/\D/g, '');
    const primeiroDigito = numeroLimpo[0];
    const doisPrimeiros = numeroLimpo.substring(0, 2);

    if (primeiroDigito === '4') return 'Visa';
    if (primeiroDigito === '5' || doisPrimeiros === '51' || doisPrimeiros === '52' || 
        doisPrimeiros === '53' || doisPrimeiros === '54' || doisPrimeiros === '55') return 'Mastercard';
    if (doisPrimeiros === '65' || doisPrimeiros === '60' || doisPrimeiros === '50' || 
        doisPrimeiros === '63' || doisPrimeiros === '64') return 'Elo';
    if (doisPrimeiros === '34' || doisPrimeiros === '37') return 'American Express';
    
    return 'Desconhecida';
  }

  async salvarCartao(
    userId: string,
    numeroCartao: string,
    nomeTitular: string,
    validadeCartao: string,
    tipo: 'credito' | 'debito'
  ) {
    try {
      // Validações básicas
      const numeroLimpo = numeroCartao.replace(/\D/g, '');
      if (numeroLimpo.length < 13 || numeroLimpo.length > 19) {
        throw new Error('Número de cartão inválido');
      }

      if (!nomeTitular || nomeTitular.trim().length < 3) {
        throw new Error('Nome do titular inválido');
      }

      if (!/^\d{2}\/\d{2}$/.test(validadeCartao)) {
        throw new Error('Validade do cartão deve estar no formato MM/AA');
      }

      // Verifica se já existe cartão igual
      const cartoesExistentes = await prismaClient.cartoesSalvos.findMany({
        where: { id_usuario: userId }
      });

      // Verifica duplicatas (compara hash)
      const hashNovo = crypto.createHash('sha256').update(numeroLimpo).digest('hex');
      for (const cartao of cartoesExistentes) {
        const hashExistente = cartao.numero_cartao.split(':')[0];
        if (hashExistente === hashNovo) {
          throw new Error('Este cartão já está salvo');
        }
      }

      // Se for o primeiro cartão ou se marcar como padrão, desmarca outros
      const padrao = cartoesExistentes.length === 0;
      if (padrao) {
        await prismaClient.cartoesSalvos.updateMany({
          where: { id_usuario: userId },
          data: { padrao: false }
        });
      }

      // Salva cartão
      const cartao = await prismaClient.cartoesSalvos.create({
        data: {
          id_usuario: userId,
          numero_cartao: this.criptografarNumero(numeroCartao),
          nome_titular: nomeTitular,
          validade_cartao: validadeCartao,
          bandeira: this.identificarBandeira(numeroCartao),
          tipo,
          padrao
        }
      });

      return {
        id: cartao.id,
        ultimos4: cartao.numero_cartao.split(':')[1],
        nome_titular: cartao.nome_titular,
        validade_cartao: cartao.validade_cartao,
        bandeira: cartao.bandeira,
        tipo: cartao.tipo,
        padrao: cartao.padrao
      };
    } catch (error: any) {
      console.error('Error in CartaoService.salvarCartao:', error);
      throw error;
    }
  }

  async listarCartoes(userId: string) {
    try {
      const cartoes = await prismaClient.cartoesSalvos.findMany({
        where: { id_usuario: userId },
        orderBy: [
          { padrao: 'desc' },
          { data_criacao: 'desc' }
        ]
      });

      return cartoes.map(cartao => ({
        id: cartao.id,
        ultimos4: cartao.numero_cartao.split(':')[1],
        nome_titular: cartao.nome_titular,
        validade_cartao: cartao.validade_cartao,
        bandeira: cartao.bandeira,
        tipo: cartao.tipo,
        padrao: cartao.padrao
      }));
    } catch (error: any) {
      console.error('Error in CartaoService.listarCartoes:', error);
      throw error;
    }
  }

  async definirPadrao(userId: string, cartaoId: string) {
    try {
      // Verifica se o cartão pertence ao usuário
      const cartao = await prismaClient.cartoesSalvos.findFirst({
        where: {
          id: cartaoId,
          id_usuario: userId
        }
      });

      if (!cartao) {
        throw new Error('Cartão não encontrado');
      }

      // Desmarca todos os outros como padrão
      await prismaClient.cartoesSalvos.updateMany({
        where: { id_usuario: userId },
        data: { padrao: false }
      });

      // Marca este como padrão
      await prismaClient.cartoesSalvos.update({
        where: { id: cartaoId },
        data: { padrao: true }
      });

      return { message: 'Cartão definido como padrão' };
    } catch (error: any) {
      console.error('Error in CartaoService.definirPadrao:', error);
      throw error;
    }
  }

  async removerCartao(userId: string, cartaoId: string) {
    try {
      const cartao = await prismaClient.cartoesSalvos.findFirst({
        where: {
          id: cartaoId,
          id_usuario: userId
        }
      });

      if (!cartao) {
        throw new Error('Cartão não encontrado');
      }

      await prismaClient.cartoesSalvos.delete({
        where: { id: cartaoId }
      });

      return { message: 'Cartão removido com sucesso' };
    } catch (error: any) {
      console.error('Error in CartaoService.removerCartao:', error);
      throw error;
    }
  }
}

export default CartaoService;












