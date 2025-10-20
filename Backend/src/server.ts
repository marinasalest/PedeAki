import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors';
import cors from 'cors';

import { router } from './router'
import { specs, swaggerUi } from './config/swagger'

const app = express()

// Middlewares
app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => {
    console.log(`🚀 Server online na porta ${PORT}!`);
    console.log(`📚 Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
})