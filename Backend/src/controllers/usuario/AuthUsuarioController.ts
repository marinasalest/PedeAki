import { Request, Response } from 'express';
import { AuthUsuarioService} from '../../services/usuario/AuthUsuarioService';

class AuthUsuarioController{
    async handle(req: Request, res: Response){
        try{
            const { email, password } = req.body;

            const authUserService = new AuthUsuarioService();

            console.log('Calling authUserService.execute');
            const auth = await authUserService.execute({email, password});

            console.log('Auth result:', auth);
        
            return res.json(auth);
        }catch (error: any) {
            console.error('Error in AuthUsuarioController:', error);
            return res.status(401).json({ error: error.message || 'Erro na autenticação do usuário' });
        }
    }
}

export { AuthUsuarioController };
