import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';

import { router } from './router'
import { specs, swaggerUi } from './config/swagger'

const app = express()

// Middlewares
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Session para Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'pedeaki_jwt_secret_key_2024',
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PedeAki API Documentation'
}));

// Routes
app.use(router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message
        })
    }

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})    
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server online na porta ${PORT}!`);
    console.log(`📚 Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
    console.log(`🌐 API disponível em: http://0.0.0.0:${PORT}`);
})