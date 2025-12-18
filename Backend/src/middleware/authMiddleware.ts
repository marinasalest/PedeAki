import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    console.log('=== AUTH MIDDLEWARE ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Authorization header:', authHeader ? 'Presente' : 'Ausente');
    console.log('Authorization value:', authHeader);

    if (!authHeader) {
      console.log('❌ Token não fornecido');
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      console.log('❌ Token mal formatado - parts.length:', parts.length);
      return res.status(401).json({ error: 'Token inválido. Formato esperado: Bearer <token>' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      console.log('❌ Scheme inválido:', scheme);
      return res.status(401).json({ error: 'Token mal formatado. Use o formato: Bearer <token>' });
    }

    if (!token || token.trim() === '') {
      console.log('❌ Token vazio');
      return res.status(401).json({ error: 'Token não pode estar vazio' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'pedeaki_jwt_secret_key_2024';
    
    console.log('🔐 Verificando token...');
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    console.log('✅ Token válido para userId:', decoded.userId);

    // Adiciona informações do usuário ao request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    return next();
  } catch (error: any) {
    console.error('❌ Erro na autenticação:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sessão expirada. Faça login novamente' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido. Verifique se o token está correto' });
    }
    return res.status(500).json({ error: 'Erro na autenticação: ' + error.message });
  }
}

// Extendendo o tipo Request do Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}















