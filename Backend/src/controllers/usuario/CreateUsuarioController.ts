import {Request, Response} from 'express'
import { CreateUsuarioService } from '../../services/usuario/CreateUsuarioService'

class CreateUsuarioController{
    async handle(req: Request, res: Response){
        try {
            const{ name, cpf, data_nascimento, email, password} = req.body;

            const enderecoId = req.body.enderecoId;
            console.log('EnderecoId from cookie:', enderecoId);

            // Converter data_nascimento de string para Date se fornecido
            let dataNascimentoDate: Date | null = null;
            if (data_nascimento) {
                dataNascimentoDate = new Date(data_nascimento);
                // Validar se a data é válida
                if (isNaN(dataNascimentoDate.getTime())) {
                    return res.status(400).json({ error: 'Data de nascimento inválida' });
                }
            }

            const createUsuarioService = new CreateUsuarioService();
            const user = await createUsuarioService.execute({name, cpf, data_nascimento: dataNascimentoDate, email, password, enderecoId});
            console.log('User created:', user);

            //res.clearCookie('enderecoId');

            return res.json({user})
        } catch (error: any) {
            console.error('Error in CreateUsuarioController:', error);
            return res.status(400).json({ error: error.message || 'Erro ao cadastrar o usuário' });
        }
    }
}

export { CreateUsuarioController }