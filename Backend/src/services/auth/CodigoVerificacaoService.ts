import prismaClient from '../../prisma';
import crypto from 'crypto';

interface CriarCodigoRequest {
  tipo: 'email' | 'sms' | 'whatsapp';
  destino: string; // email, telefone ou número WhatsApp
}

class CodigoVerificacaoService {
  async gerarCodigo({ tipo, destino }: CriarCodigoRequest) {
    try {
      // Gera código de 6 dígitos
      const codigo6Digitos = crypto.randomInt(100000, 999999).toString();

      // Expira em 10 minutos
      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 10);

      // Invalida códigos anteriores não usados
      await prismaClient.codigosVerificacao.updateMany({
        where: {
          destino,
          tipo,
          usado: false,
          data_expiracao: {
            gt: new Date()
          }
        },
        data: {
          usado: true
        }
      });

      // Cria novo código
      const codigo = await prismaClient.codigosVerificacao.create({
        data: {
          tipo,
          destino,
          codigo_6_digitos: codigo6Digitos,
          data_expiracao: dataExpiracao,
          max_tentativas: 3
        }
      });

      return {
        id: codigo.id,
        codigo_6_digitos: codigo6Digitos,
        tipo,
        destino: this.mascararDestino(destino, tipo),
        expira_em: dataExpiracao
      };
    } catch (error) {
      console.error('Error in CodigoVerificacaoService.gerarCodigo:', error);
      throw new Error('Erro ao gerar código de verificação');
    }
  }

  async validarCodigo(destino: string, codigo6Digitos: string, tipo: 'email' | 'sms' | 'whatsapp') {
    try {
      const codigo = await prismaClient.codigosVerificacao.findFirst({
        where: {
          destino,
          codigo_6_digitos: codigo6Digitos,
          tipo,
          usado: false
        },
        orderBy: {
          data_criacao: 'desc'
        }
      });

      if (!codigo) {
        throw new Error('Código inválido ou não encontrado');
      }

      // Verifica se expirou
      if (new Date() > codigo.data_expiracao) {
        await prismaClient.codigosVerificacao.update({
          where: { id: codigo.id },
          data: { usado: true }
        });
        throw new Error('Código expirado. Solicite um novo código');
      }

      // Verifica tentativas
      if (codigo.tentativas >= codigo.max_tentativas) {
        await prismaClient.codigosVerificacao.update({
          where: { id: codigo.id },
          data: { usado: true }
        });
        throw new Error('Número máximo de tentativas excedido. Solicite um novo código');
      }

      // Incrementa tentativas
      await prismaClient.codigosVerificacao.update({
        where: { id: codigo.id },
        data: {
          tentativas: codigo.tentativas + 1
        }
      });

      // Marca como usado
      await prismaClient.codigosVerificacao.update({
        where: { id: codigo.id },
        data: { usado: true }
      });

      return {
        valido: true,
        codigo_id: codigo.id
      };
    } catch (error: any) {
      console.error('Error in CodigoVerificacaoService.validarCodigo:', error);
      throw error;
    }
  }

  private mascararDestino(destino: string, tipo: string): string {
    if (tipo === 'email') {
      const [nome, dominio] = destino.split('@');
      return `${nome.substring(0, 2)}***@${dominio}`;
    } else {
      // Telefone ou WhatsApp
      return destino.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-****');
    }
  }
}

export default CodigoVerificacaoService;















