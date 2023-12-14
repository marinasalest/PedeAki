import {Request, Response, response} from 'express'
import { CreateUsuarioService } from '../../services/usuario/CreateUsuarioService'

class CreateUsuarioController{
    async handle(req: Request, res: Response){
        const{ name, cpf, data_nascimento, email, password} = req.body;

        const enderecoId = req.body.enderecoId;
        console.log('EnderecoId from cookie:', enderecoId);

        const createUsuarioService = new CreateUsuarioService();
        const user = await createUsuarioService.execute({name, cpf, data_nascimento, email, password, enderecoId});
        console.log('User created:', user);

        //res.clearCookie('enderecoId');

        return res.json({user})
    }catch (error: any) {
        console.error('Error in CreateUsuarioController:', error);
        return response.status(500).json({ message: 'Erro ao cadastrar o usuário' });
    }

}

export { CreateUsuarioController }