import nodemailer from 'nodemailer';
import twilio from 'twilio';

class EnvioCodigoService {
  private transporter: any;
  private twilioClient: any;

  constructor() {
    // Configuração do email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Configuração do Twilio (SMS e WhatsApp)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  async enviarPorEmail(destino: string, codigo: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.warn('SMTP não configurado. Código seria:', codigo);
        return false;
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@pedeaki.com',
        to: destino,
        subject: 'Código de Verificação - PedeAki',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Código de Verificação</h2>
            <p>Seu código de verificação é:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${codigo}
            </div>
            <p>Este código expira em 10 minutos.</p>
            <p>Se você não solicitou este código, ignore este email.</p>
          </div>
        `
      });

      return true;
    } catch (error) {
      console.error('Error in EnvioCodigoService.enviarPorEmail:', error);
      // Em desenvolvimento, apenas loga o código
      console.log(`[DEV] Código de verificação para ${destino}: ${codigo}`);
      return false;
    }
  }

  async enviarPorSMS(destino: string, codigo: string): Promise<boolean> {
    try {
      if (!this.twilioClient) {
        console.warn('Twilio não configurado. Código seria:', codigo);
        return false;
      }

      await this.twilioClient.messages.create({
        body: `Seu código de verificação PedeAki é: ${codigo}. Válido por 10 minutos.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: destino
      });

      return true;
    } catch (error) {
      console.error('Error in EnvioCodigoService.enviarPorSMS:', error);
      // Em desenvolvimento, apenas loga o código
      console.log(`[DEV] Código SMS para ${destino}: ${codigo}`);
      return false;
    }
  }

  async enviarPorWhatsApp(destino: string, codigo: string): Promise<boolean> {
    try {
      if (!this.twilioClient) {
        console.warn('Twilio não configurado. Código seria:', codigo);
        return false;
      }

      const whatsappNumber = `whatsapp:${destino}`;
      const twilioWhatsApp = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

      await this.twilioClient.messages.create({
        body: `Seu código de verificação PedeAki é: ${codigo}. Válido por 10 minutos.`,
        from: twilioWhatsApp,
        to: whatsappNumber
      });

      return true;
    } catch (error) {
      console.error('Error in EnvioCodigoService.enviarPorWhatsApp:', error);
      // Em desenvolvimento, apenas loga o código
      console.log(`[DEV] Código WhatsApp para ${destino}: ${codigo}`);
      return false;
    }
  }

  async enviarCodigo(tipo: 'email' | 'sms' | 'whatsapp', destino: string, codigo: string): Promise<boolean> {
    switch (tipo) {
      case 'email':
        return this.enviarPorEmail(destino, codigo);
      case 'sms':
        return this.enviarPorSMS(destino, codigo);
      case 'whatsapp':
        return this.enviarPorWhatsApp(destino, codigo);
      default:
        throw new Error('Tipo de envio inválido');
    }
  }
}

export default EnvioCodigoService;















