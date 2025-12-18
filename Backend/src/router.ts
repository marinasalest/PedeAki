import { Router } from 'express'
import multer from 'multer'
import passport from './config/passport'

import { CreateUsuarioController } from './controllers/usuario/CreateUsuarioController'
import { AuthUsuarioController } from './controllers/usuario/AuthUsuarioController'
import UsuarioController from './controllers/usuario/UsuarioController'
import UpdateUsuarioController from './controllers/usuario/UpdateUsuarioController'
import DeleteUsuarioController from './controllers/usuario/DeleteUsuarioController'
import SocialAuthController from './controllers/usuario/SocialAuthController'
import LoginComCodigoController from './controllers/auth/LoginComCodigoController'
import RecuperarSenhaController from './controllers/usuario/RecuperarSenhaController'

import  EnderecoController from './controllers/endereco/EnderecoController'
import  ReadEnderecoController from './controllers/endereco/ReadEnderecoController'
import  ReadEnderecoByIdController from './controllers/endereco/ReadEnderecoByIdController'
import  UpdateEnderecoController from './controllers/endereco/UpdateEnderecoController'
import DeleteEnderecoController from './controllers/endereco/DeleteEnderecoController'

import CreateCategoriaController from './controllers/categoria/CreateCategoriaController'
import CategoriaController from './controllers/categoria/CategoriaController'
import ReadCategoriaController from './controllers/categoria/ReadCategoriaController'
import UpdateCategoriaController from './controllers/categoria/UpdateCategoriaController'
import DeleteCategoriaController from './controllers/categoria/DeleteCategoriaController'

import CreateRestauranteController from './controllers/restaurante/CreateRestauranteController'
import RestauranteController from './controllers/restaurante/RestauranteController'
import ReadRestauranteController from './controllers/restaurante/ReadRestauranteController'
import GetRestaurantesByEnderecoController from './controllers/restaurante/GetRestaurantesByEnderecoController'
import UpdateRestauranteController from './controllers/restaurante/UpdateRestauranteController'
import DeleteRestauranteController from './controllers/restaurante/DeleteRestauranteController'

import CreateProdutosController from './controllers/produto/CreateProdutosController'
import ProdutoController from './controllers/produto/ProdutoController'
import ReadProdutoController from './controllers/produto/ReadProdutoController'
import GetProdutosByCategoriaController from './controllers/produto/GetProdutosByCategoriaController'
import GetProdutosByRestauranteController from './controllers/produto/GetProdutosByRestauranteController'
import GetCardapioController from './controllers/produto/GetCardapioController'
import UpdateProdutoController from './controllers/produto/UpdateProdutoController'
import DeleteProdutoController from './controllers/produto/DeleteProdutoController'

import CarrinhoController from './controllers/carrinho/CarrinhoController'
import CreatePedidoController from './controllers/pedido/CreatePedidoController'
import AcompanhamentoPedidoController from './controllers/pedido/AcompanhamentoPedidoController'
import NotaFiscalController from './controllers/pedido/NotaFiscalController'
import PagamentoController from './controllers/pagamento/PagamentoController'
import CartaoController from './controllers/pagamento/CartaoController'
import CupomController from './controllers/cupom/CupomController'
import AvaliacaoController from './controllers/avaliacao/AvaliacaoController'
import ListRestaurantesController from './controllers/restaurante/ListRestaurantesController'

import { authMiddleware } from './middleware/authMiddleware'

import uploadConfig from './config/multer'

const router = Router();
const storage = uploadConfig.upload('./tmp').Storage;
const upload = multer({ storage });

const createUsuarioController = new CreateUsuarioController();
const authUsuarioController = new AuthUsuarioController();
const usuarioController = new UsuarioController;
const updateUsuarioController = new UpdateUsuarioController();
const deleteUsuarioController = new DeleteUsuarioController();
const loginComCodigoController = new LoginComCodigoController();
const recuperarSenhaController = new RecuperarSenhaController();
const socialAuthController = new SocialAuthController();

const enderecoController = new EnderecoController;
const readEnderecoController = new ReadEnderecoController;
const readEnderecoByIdController = new ReadEnderecoByIdController();
const updateEnderecoController = new UpdateEnderecoController;
const deleteEnderecoController = new DeleteEnderecoController;

const createCategoriaController = new CreateCategoriaController;
const categoriaController = new CategoriaController;
const readCategoriaController = new ReadCategoriaController();
const updateCategoriaController = new UpdateCategoriaController();
const deleteCategoriaController = new DeleteCategoriaController();

const createRestauranteController = new CreateRestauranteController();
const restauranteController = new RestauranteController();
const readRestauranteController = new ReadRestauranteController();
const getRestaurantesByEnderecoController = new GetRestaurantesByEnderecoController();
const updateRestauranteController = new UpdateRestauranteController();
const deleteRestauranteController = new DeleteRestauranteController();

const createProdutosController = new CreateProdutosController();
const produtoController = new ProdutoController();
const readProdutoController = new ReadProdutoController();
const getProdutosByCategoriaController = new GetProdutosByCategoriaController();
const getProdutosByRestauranteController = new GetProdutosByRestauranteController();
const updateProdutoController = new UpdateProdutoController();
const deleteProdutoController = new DeleteProdutoController();
const getCardapioController = new GetCardapioController();

const carrinhoController = new CarrinhoController();
const createPedidoController = new CreatePedidoController();
const acompanhamentoPedidoController = new AcompanhamentoPedidoController();
const notaFiscalController = new NotaFiscalController();
const pagamentoController = new PagamentoController();
const cartaoController = new CartaoController();
const cupomController = new CupomController();
const avaliacaoController = new AvaliacaoController();
const listRestaurantesController = new ListRestaurantesController();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Usuários]
 *     description: |
 *       Cadastra um novo usuário no sistema com validação completa de dados.
 *       
 *       **Regras de Negócio:**
 *       - Usuário deve ter pelo menos 18 anos (validado pela data_nascimento)
 *       - CPF deve ser válido e único no sistema (formato: XXX.XXX.XXX-XX)
 *       - Email deve ser válido e único no sistema
 *       - Senha deve ter mínimo 6 caracteres (será criptografada com bcrypt)
 *       - Endereço é obrigatório para cadastro (enderecoId deve existir)
 *       - Sessão expira após 24 horas de inatividade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cpf
 *               - data_nascimento
 *               - email
 *               - password
 *               - enderecoId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: 'Nome completo do usuário (obrigatório, mínimo 3 caracteres, máximo 100)'
 *                 example: "João Silva"
 *               cpf:
 *                 type: string
 *                 pattern: '^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}$'
 *                 description: 'CPF no formato XXX.XXX.XXX-XX (obrigatório, deve ser válido e único)'
 *                 example: "123.456.789-00"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: 'Data de nascimento no formato YYYY-MM-DD (obrigatório, usuário deve ter pelo menos 18 anos)'
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: 'Email do usuário (obrigatório, deve ser válido e único)'
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: 'Senha do usuário (obrigatório, mínimo 6 caracteres, será criptografada)'
 *                 example: "senha123"
 *               enderecoId:
 *                 type: string
 *                 format: uuid
 *                 description: 'ID do endereço cadastrado (obrigatório, endereço deve existir)'
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação (CPF inválido, email duplicado, idade insuficiente, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/users', createUsuarioController.handle);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticar usuário com email e senha
 *     tags: [Usuários]
 *     description: |
 *       Autentica um usuário no sistema usando email e senha.
 *       
 *       **Regras de Negócio:**
 *       - Email e senha são obrigatórios
 *       - Senha é comparada com hash bcrypt armazenado
 *       - Token JWT é gerado com validade de 24 horas
 *       - Sessão expira após 24 horas de inatividade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: 'Email do usuário (obrigatório, deve estar cadastrado)'
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: 'Senha do usuário (obrigatório, mínimo 6 caracteres)'
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login efetuado com sucesso"
 *                 token:
 *                   type: string
 *                   description: 'Token JWT válido por 24 horas. Use no header Authorization: Bearer {token}'
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas (email não encontrado ou senha incorreta)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', authUsuarioController.handle);

/**
 * @swagger
 * /auth/solicitar-codigo:
 *   post:
 *     summary: Solicitar código de verificação de 6 dígitos
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - destino
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [email, sms, whatsapp]
 *                 example: "email"
 *               destino:
 *                 type: string
 *                 example: "usuario@email.com"
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 destino_mascarado:
 *                   type: string
 *                 expira_em:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro na solicitação
 */
router.post('/auth/solicitar-codigo', loginComCodigoController.solicitarCodigo);

/**
 * @swagger
 * /auth/validar-codigo:
 *   post:
 *     summary: Validar código de 6 dígitos e fazer login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - destino
 *               - codigo
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [email, sms, whatsapp]
 *                 example: "email"
 *               destino:
 *                 type: string
 *                 example: "usuario@email.com"
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Código inválido ou expirado
 */
router.post('/auth/validar-codigo', loginComCodigoController.validarCodigo);

/**
 * @swagger
 * /auth/recuperar-senha:
 *   post:
 *     summary: Solicitar código de recuperação de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@email.com"
 *     responses:
 *       200:
 *         description: Código de recuperação enviado
 */
router.post('/auth/recuperar-senha', recuperarSenhaController.solicitarRecuperacao);

/**
 * @swagger
 * /auth/redefinir-senha:
 *   post:
 *     summary: Redefinir senha com código de verificação
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - codigo
 *               - novaSenha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *               novaSenha:
 *                 type: string
 *                 example: "novasenha123"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 */
router.post('/auth/redefinir-senha', recuperarSenhaController.redefinirSenha);

// Rota antiga removida - usar POST /auth/login/facebook

// Rota antiga removida - usar POST /auth/login/facebook

// Rota antiga removida - usar POST /auth/login/google

// Rota antiga removida - usar POST /auth/login/google

/**
 * @swagger
 * /auth/login/facebook:
 *   post:
 *     summary: Login com Facebook (validação por email)
 *     tags: [Autenticação Social]
 *     description: Faz login com Facebook validando o email na base de dados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@email.com"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Email não fornecido
 *       401:
 *         description: Usuário não encontrado ou não cadastrado com Facebook
 */
router.post('/auth/login/facebook', socialAuthController.loginWithFacebook);

/**
 * @swagger
 * /auth/login/google:
 *   post:
 *     summary: Login com Google (validação por email)
 *     tags: [Autenticação Social]
 *     description: Faz login com Google validando o email na base de dados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@email.com"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Email não fornecido
 *       401:
 *         description: Usuário não encontrado ou não cadastrado com Google
 */
router.post('/auth/login/google', socialAuthController.loginWithGoogle);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/usuarios', usuarioController.getAllUsuarios);

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva Santos"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               password:
 *                 type: string
 *                 example: "novasenha123"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/usuario/:id', usuarioController.getUsuarioById);
router.put('/usuario/:id', updateUsuarioController.updateUser);
router.delete('/usuario/:id', deleteUsuarioController.deleteUsuario);

/**
 * @swagger
 * /endereco:
 *   post:
 *     summary: Criar novo endereço
 *     tags: [Endereços]
 *     description: |
 *       Cria um novo endereço de entrega.
 *       
 *       **Regras de Negócio:**
 *       - Endereço é obrigatório para cadastro de usuário
 *       - CEP é usado para calcular distância e validar entrega (máximo 10 km do restaurante)
 *       - Latitude e longitude são calculadas automaticamente se não fornecidas
 *       - Usuário só vê restaurantes que entregam no CEP informado
 *       - Restaurantes devem estar até no máximo 10 km do endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rua
 *               - numero
 *               - bairro
 *               - cidade
 *               - estado
 *               - cep
 *             properties:
 *               rua:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 description: 'Nome da rua ou logradouro (obrigatório, mínimo 3 caracteres, máximo 200)'
 *                 example: "Rua das Flores"
 *               numero:
 *                 type: string
 *                 maxLength: 20
 *                 description: 'Número do endereço (obrigatório, máximo 20 caracteres)'
 *                 example: "123"
 *               complemento:
 *                 type: string
 *                 maxLength: 100
 *                 description: 'Complemento do endereço (opcional, máximo 100 caracteres)'
 *                 example: "Apto 45"
 *               bairro:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: 'Nome do bairro (obrigatório, mínimo 2 caracteres, máximo 100)'
 *                 example: "Centro"
 *               cidade:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: 'Nome da cidade (obrigatório, mínimo 2 caracteres, máximo 100)'
 *                 example: "São Paulo"
 *               estado:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 'Nome completo ou sigla do estado (obrigatório, mínimo 2 caracteres, máximo 50)'
 *                 example: "São Paulo"
 *               cep:
 *                 type: string
 *                 pattern: '^[0-9]{8}$'
 *                 description: 'CEP no formato 8 dígitos sem hífen (obrigatório). Usado para calcular distância e validar entrega.'
 *                 example: "01310100"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: 'Latitude do endereço (opcional, calculada automaticamente se não fornecida)'
 *                 example: -23.5505
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: 'Longitude do endereço (opcional, calculada automaticamente se não fornecida)'
 *                 example: -46.6333
 *     responses:
 *       200:
 *         description: Endereço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 endereco:
 *                   $ref: '#/components/schemas/Endereco'
 *       400:
 *         description: Erro de validação (CEP inválido, campos obrigatórios faltando, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/endereco', enderecoController.createAddress);

/**
 * @swagger
 * /allEnderecos:
 *   get:
 *     summary: Listar todos os endereços
 *     tags: [Endereços]
 *     responses:
 *       200:
 *         description: Lista de endereços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enderecos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Endereco'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/allEnderecos', readEnderecoController.getAllEnderecos);

/**
 * @swagger
 * /endereco/{id}:
 *   get:
 *     summary: Buscar endereço por ID
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Endereço encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 endereco:
 *                   $ref: '#/components/schemas/Endereco'
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Atualizar endereço
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Endereco'
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 endereco:
 *                   $ref: '#/components/schemas/Endereco'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Deletar endereço
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Endereço deletado com sucesso
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/endereco/:id', readEnderecoByIdController.getEnderecoById);
router.put('/endereco/:id', updateEnderecoController.updateEnderecoField);
router.delete('/endereco/:id', deleteEnderecoController.deleteEndereco);

/**
 * @swagger
 * /categoria:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/categoria', createCategoriaController.createCategoria);

/**
 * @swagger
 * /allCategorias:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/allCategorias', categoriaController.getAllCategorias);

/**
 * @swagger
 * /categoria/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "LANCHE"
 *     responses:
 *       200:
 *         description: Categoria encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/categoria/:id', readCategoriaController.getCategoriaById);

/**
 * @swagger
 * /categoria/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "LANCHE"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "LANCHE"
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/categoria/:id', updateCategoriaController.updateCategoria);
router.delete('/categoria/:id', deleteCategoriaController.deleteCategoria);

/**
 * @swagger
 * /restaurante:
 *   post:
 *     summary: Criar novo restaurante
 *     tags: [Restaurantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurante'
 *     responses:
 *       200:
 *         description: Restaurante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurante:
 *                   $ref: '#/components/schemas/Restaurante'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/restaurante', createRestauranteController.createRestaurante);

/**
 * @swagger
 * /allRestaurantes:
 *   get:
 *     summary: Listar todos os restaurantes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurante'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/allRestaurantes', restauranteController.getAllRestaurantes);

/**
 * @swagger
 * /restaurante/{id}:
 *   get:
 *     summary: Buscar restaurante por ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Restaurante encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurante:
 *                   $ref: '#/components/schemas/Restaurante'
 *       404:
 *         description: Restaurante não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Atualizar restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Restaurante Atualizado"
 *               cnpj:
 *                 type: string
 *                 example: "12.345.678/0001-90"
 *               nome_fantasia:
 *                 type: string
 *                 example: "Nome Fantasia Atualizado"
 *               senha:
 *                 type: string
 *                 example: "novasenha123"
 *               telefone:
 *                 type: string
 *                 example: "(11) 98765-4321"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "novoemail@restaurante.com"
 *               avaliacao:
 *                 type: string
 *                 example: "4.5"
 *               enderecoId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Restaurante atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurante:
 *                   $ref: '#/components/schemas/Restaurante'
 *       400:
 *         description: Erro ao atualizar restaurante
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/restaurante/:id', readRestauranteController.getRestauranteById);
router.put('/restaurante/:id', updateRestauranteController.updateRestaurante);

/**
 * @swagger
 * /restaurante/{id}:
 *   delete:
 *     summary: Deletar restaurante por ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Restaurante deletado com sucesso (sem conteúdo)
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restaurante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/restaurante/:id', deleteRestauranteController.deleteRestaurante);

/**
 * @swagger
 * /restaurantes/endereco/{enderecoId}:
 *   get:
 *     summary: Buscar restaurantes por endereço
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: enderecoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Lista de restaurantes do endereço retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurante'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/restaurantes/endereco/:enderecoId', getRestaurantesByEnderecoController.getRestaurantesByEndereco);

/**
 * @swagger
 * /produto:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name_produto
 *               - preco
 *               - id_restaurante
 *               - id_categoria
 *             properties:
 *               name_produto:
 *                 type: string
 *                 example: "Hambúrguer Clássico"
 *               preco:
 *                 type: number
 *                 format: float
 *                 example: 25.90
 *               descricao:
 *                 type: string
 *                 example: "Hambúrguer com carne, queijo, alface e tomate"
 *               id_restaurante:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               id_categoria:
 *                 type: string
 *                 example: "LANCHE"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do produto
 *     responses:
 *       200:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produto:
 *                   $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/produto', upload.single('file'), createProdutosController.createProduto);

/**
 * @swagger
 * /allProdutos:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/allProdutos', produtoController.getAllProdutos);

/**
 * @swagger
 * /produto/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produto:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name_produto:
 *                 type: string
 *                 example: "Hambúrguer Atualizado"
 *               preco:
 *                 type: number
 *                 format: float
 *                 example: 29.90
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada"
 *               restauranteId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               categoriaId:
 *                 type: string
 *                 example: "LANCHE"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem do produto (opcional)
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produto:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Erro ao atualizar produto
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Deletar produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/produto/:id', readProdutoController.getProdutoById);
router.put('/produto/:id', upload.single('file'), updateProdutoController.updateProduto);
router.delete('/produto/:id', deleteProdutoController.deleteProduto);

/**
 * @swagger
 * /produtos/categoria/{categoriaId}:
 *   get:
 *     summary: Buscar produtos por categoria
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: categoriaId
 *         required: true
 *         schema:
 *           type: string
 *         example: "LANCHE"
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/produtos/categoria/:categoriaId', getProdutosByCategoriaController.getProdutosByCategoria);

/**
 * @swagger
 * /produtos/restaurante/{restauranteId}:
 *   get:
 *     summary: Buscar produtos por restaurante
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: restauranteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Lista de produtos do restaurante retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/produtos/restaurante/:restauranteId', getProdutosByRestauranteController.getProdutosByRestaurante);

/**
 * @swagger
 * /cardapio/{restauranteId}:
 *   get:
 *     summary: Obter cardápio do restaurante
 *     tags: [Produtos]
 *     description: |
 *       Retorna o cardápio completo do restaurante com produtos organizados por categorias.
 *       
 *       **Regras de Negócio:**
 *       - O usuário somente pode visualizar o cardápio de restaurantes abertos e que atendem ao seu endereço de entrega
 *       - Restaurantes devem estar até no máximo 10 km do endereço do usuário
 *       - Produtos com indisponibilidade de estoque devem aparecer bloqueados e não podem ser adicionados ao carrinho
 *       - Itens com horário específico de funcionamento só ficam visíveis ou habilitados dentro do período configurado
 *       - Produtos devem exibir obrigatoriamente: nome, preço e categoria; descrição e imagem são opcionais
 *       - O sistema impede a visualização de produtos inativos ou não associados a um restaurante ou categoria válida
 *       - Produtos são organizados por categorias no retorno
 *     parameters:
 *       - in: path
 *         name: restauranteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 'ID único do restaurante (obrigatório, deve ser um UUID válido)'
 *         example: "4ea5aa18-1ead-49bf-8313-3770fe6b72ca"
 *       - in: query
 *         name: enderecoId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 'ID do endereço para verificar se o restaurante atende (opcional). Se fornecido, valida distância máxima de 10 km.'
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Cardápio retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurante:
 *                   type: object
 *                   description: Dados do restaurante
 *                 produtos:
 *                   type: array
 *                   description: Lista de produtos organizados por categoria
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *       400:
 *         description: |
 *           Erro de validação. Possíveis causas:
 *           - ID inválido (não é UUID)
 *           - Restaurante inativo
 *           - Restaurante não atende ao endereço (distância > 10 km)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restaurante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/cardapio/:restauranteId', getCardapioController.handle);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware);

/**
 * @swagger
 * /carrinho:
 *   get:
 *     summary: Obter carrinho do usuário
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retorna o carrinho de compras do usuário autenticado com resumo automático.
 *       
 *       **Regras de Negócio:**
 *       - Carrinho expira após 30 minutos se não houver finalização
 *       - Retorna subtotal, taxa de entrega, descontos e valor total
 *       - Verifica automaticamente valor mínimo obrigatório do restaurante
 *       - Valida disponibilidade e estoque dos produtos
 *     responses:
 *       200:
 *         description: Carrinho retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itens:
 *                   type: array
 *                   description: Lista de itens no carrinho
 *                 subtotal:
 *                   type: number
 *                   format: float
 *                   description: Subtotal dos itens (sem taxa e desconto)
 *                 taxa_entrega:
 *                   type: number
 *                   format: float
 *                   description: Taxa de entrega calculada
 *                 desconto:
 *                   type: number
 *                   format: float
 *                   description: Valor do desconto aplicado
 *                 total:
 *                   type: number
 *                   format: float
 *                   description: Valor total (subtotal + taxa - desconto)
 *   post:
 *     summary: Adicionar item ao carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Adiciona um item ao carrinho de compras.
 *       
 *       **Regras de Negócio:**
 *       - Produto deve estar disponível e ativo
 *       - Produto deve ter estoque suficiente (se estoque limitado)
 *       - Quantidade não pode exceder quantidade_maxima_pedido do produto
 *       - Produto deve estar dentro do horário de funcionamento (se configurado)
 *       - Não é possível adicionar produtos de restaurantes diferentes no mesmo carrinho
 *       - Opções adicionais seguem preços definidos pelo restaurante e são somadas ao valor
 *       - Personalização só é permitida se o produto permite_personalizacao = true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produtoId
 *               - quantidade
 *             properties:
 *               produtoId:
 *                 type: string
 *                 format: uuid
 *                 description: 'ID do produto (obrigatório, deve existir e estar disponível)'
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 description: 'Quantidade do produto (obrigatório, mínimo 1, máximo conforme quantidade_maxima_pedido)'
 *                 example: 2
 *               observacoes:
 *                 type: string
 *                 maxLength: 500
 *                 description: 'Observações do item (opcional, máximo 500 caracteres)'
 *                 example: "Bem passado, sem pimenta"
 *               personalizacoes:
 *                 type: object
 *                 description: 'Personalizações do produto (opcional, só permitido se produto permite_personalizacao = true)'
 *                 example: {"remover": ["cebola"], "adicionar": ["bacon"]}
 *               opcoes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: 'IDs das opções adicionais selecionadas (opcional, preços são somados ao produto)'
 *                 example: ["opcao-id-1", "opcao-id-2"]
 *     responses:
 *       200:
 *         description: Item adicionado ao carrinho com sucesso
 *       400:
 *         description: |
 *           Erro ao adicionar item. Possíveis causas:
 *           - Produto indisponível ou inativo
 *           - Estoque insuficiente
 *           - Quantidade excede o máximo permitido
 *           - Produto fora do horário de funcionamento
 *           - Produto de restaurante diferente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/carrinho', carrinhoController.obterCarrinho);
router.post('/carrinho', carrinhoController.adicionarItem);
router.put('/carrinho/:itemId', carrinhoController.atualizarQuantidade);
router.delete('/carrinho/:itemId', carrinhoController.removerItem);

/**
 * @swagger
 * /carrinho/{id}:
 *   put:
 *     summary: Atualizar carrinho por ID
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Carrinho atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar carrinho
 */
router.put('/carrinho/:id', carrinhoController.atualizarCarrinho);

/**
 * @swagger
 * /carrinho/{id}:
 *   delete:
 *     summary: Esvaziar carrinho por ID
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Carrinho esvaziado com sucesso
 *       400:
 *         description: Erro ao esvaziar carrinho
 */
router.delete('/carrinho/:id', carrinhoController.esvaziarCarrinho);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar novo pedido a partir do carrinho
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Cria um pedido usando os itens do carrinho do usuário.
 *       
 *       **Regras de Negócio:**
 *       - Carrinho não pode estar vazio
 *       - Valor mínimo do restaurante deve ser respeitado
 *       - Se formaPagamento for "credito", busca automaticamente o cartão padrão cadastrado
 *       - Se formaPagamento for "credito" e não houver cartão, retorna erro
 *       - Cupom de desconto só pode ser usado uma vez por usuário
 *       - Cupom pode ser exclusivo para determinados restaurantes
 *       - Itens do carrinho expiram após 30 min se não houver finalização
 *       - Pedido é criado com status CONFIRMADO (pedido feito)
 *       - Carrinho é limpo automaticamente após criação do pedido
 *       - Pedido só é enviado ao restaurante após aprovação financeira
 *       - Se pagamento falhar, pedido é automaticamente cancelado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formaPagamento
 *               - tipoEntrega
 *             properties:
 *               formaPagamento:
 *                 type: string
 *                 enum: [credito, debito, dinheiro, pix]
 *                 description: |
 *                   Forma de pagamento (obrigatório).
 *                   - credito: Busca automaticamente o cartão padrão cadastrado
 *                   - debito: Pagamento com cartão de débito
 *                   - dinheiro: Pagamento em dinheiro (pode informar troco)
 *                   - pix: Gera QR Code automaticamente (expira em 10 min)
 *                 example: "credito"
 *               tipoEntrega:
 *                 type: string
 *                 enum: [retirada, padrao, express]
 *                 description: |
 *                   Tipo de entrega (obrigatório).
 *                   - retirada: Cliente retira no restaurante (taxa_entrega = 0)
 *                   - padrao: Entrega padrão (taxa normal)
 *                   - express: Entrega prioritária (taxa maior, tempo menor)
 *                 example: "padrao"
 *               codigoCupom:
 *                 type: string
 *                 maxLength: 50
 *                 description: |
 *                   Código do cupom de desconto (opcional).
 *                   - Só pode ser usado uma vez por usuário
 *                   - Pode ser exclusivo para determinados restaurantes
 *                   - Deve estar válido e não expirado
 *                 example: "DESCONTO10"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pedido criado com sucesso"
 *                 pedido:
 *                   $ref: '#/components/schemas/Pedido'
 *                   description: Dados completos do pedido criado (status CONFIRMADO)
 *                 carrinho:
 *                   type: object
 *                   description: Dados do carrinho usado para criar o pedido
 *                 cartao:
 *                   type: object
 *                   nullable: true
 *                   description: Dados do cartão usado (se formaPagamento for "credito")
 *       400:
 *         description: |
 *           Erro ao criar pedido. Possíveis causas:
 *           - Carrinho vazio
 *           - Cartão não encontrado (se formaPagamento = "credito")
 *           - Valor mínimo do restaurante não atingido
 *           - Cupom inválido ou já usado
 *           - Estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/pedidos', createPedidoController.handle);

/**
 * @swagger
 * /pedidos/{pedidoId}:
 *   get:
 *     summary: Obter detalhes do pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Busca os detalhes completos de um pedido específico pelo seu ID.
 *       O pedido deve pertencer ao usuário autenticado.
 *       
 *       **Como usar no Swagger:**
 *       1. Clique em "Try it out"
 *       2. Substitua {pedidoId} pelo ID real do pedido (UUID)
 *       3. Exemplo: /pedidos/123e4567-e89b-12d3-a456-426614174000
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do pedido (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Pedido retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedido:
 *                   type: object
 *                   description: Dados completos do pedido incluindo restaurante, endereço, itens, pagamentos e histórico de status
 *       400:
 *         description: ID inválido ou erro ao buscar pedido
 *       403:
 *         description: Pedido não pertence a este usuário
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/pedidos/:pedidoId', acompanhamentoPedidoController.obterPedido);

/**
 * @swagger
 * /pedidos/{pedidoId}/status:
 *   put:
 *     summary: Atualizar status do pedido (apenas status permitidos)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CANCELADO, PREPARANDO, EM_ROTA, ENTREGUE]
 *                 description: |
 *                   Status permitidos para atualização:
 *                   - CANCELADO: Cancela o pedido
 *                   - PREPARANDO: Pedido sendo preparado
 *                   - EM_ROTA: Pedido saiu para entrega
 *                   - ENTREGUE: Pedido foi entregue
 *                   
 *                   Nota: Apenas estes 4 status podem ser atualizados via este endpoint.
 *                   Outros status como PEDIDO_FEITO, PENDENTE, etc. são gerenciados automaticamente pelo sistema.
 *                 example: "PREPARANDO"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso (data e hora preenchidas automaticamente)
 *       400:
 *         description: Erro ao atualizar status
 */
router.put('/pedidos/:pedidoId/status', acompanhamentoPedidoController.atualizarStatus);
router.post('/pedidos/:pedidoId/cancelar', acompanhamentoPedidoController.cancelarPedido);
router.put('/pedidos/:pedidoId/endereco', acompanhamentoPedidoController.alterarEndereco);
router.post('/pedidos/:pedidoId/recusar', acompanhamentoPedidoController.recusarPedido);

/**
 * @swagger
 * /pedidos/{pedidoId}/item/{itemId}:
 *   put:
 *     summary: Atualizar item do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidade:
 *                 type: number
 *               observacoes:
 *                 type: string
 *               personalizacoes:
 *                 type: object
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar item
 */
router.put('/pedidos/:pedidoId/item/:itemId', acompanhamentoPedidoController.atualizarItemPedido);
/**
 * @swagger
 * /pedidos/:pedidoId/nota-fiscal:
 *   get:
 *     summary: Gerar Nota Fiscal do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota Fiscal gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 notaFiscal:
 *                   type: object
 */
router.get('/pedidos/:pedidoId/nota-fiscal', authMiddleware, notaFiscalController.gerarNotaFiscal);

/**
 * @swagger
 * /pagamento:
 *   post:
 *     summary: Processar pagamento
 *     tags: [Pagamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *               formaPagamento:
 *                 type: string
 *               dadosPagamento:
 *                 type: object
 *     responses:
 *       200:
 *         description: Pagamento processado
 */
router.post('/pagamento', pagamentoController.processar);

/**
 * @swagger
 * /cartoes:
 *   get:
 *     summary: Listar cartões salvos do usuário
 *     tags: [Pagamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cartões
 *   post:
 *     summary: Salvar novo cartão
 *     tags: [Pagamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroCartao
 *               - nomeTitular
 *               - validadeCartao
 *               - tipo
 *             properties:
 *               numeroCartao:
 *                 type: string
 *               nomeTitular:
 *                 type: string
 *               validadeCartao:
 *                 type: string
 *                 example: "12/25"
 *               tipo:
 *                 type: string
 *                 enum: [credito, debito]
 *     responses:
 *       201:
 *         description: Cartão salvo com sucesso
 */
router.get('/cartoes', cartaoController.listarCartoes);
router.post('/cartoes', cartaoController.salvarCartao);
router.put('/cartoes/:cartaoId/padrao', cartaoController.definirPadrao);
router.delete('/cartoes/:cartaoId', cartaoController.removerCartao);

/**
 * @swagger
 * /cupons/validar:
 *   post:
 *     summary: Validar cupom de desconto
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               restauranteId:
 *                 type: string
 *               valorPedido:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cupom validado
 */
router.post('/cupons/validar', cupomController.validar);

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     summary: Criar avaliação do pedido
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *               denuncia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada
 */
router.post('/avaliacoes', avaliacaoController.criar);

/**
 * @swagger
 * /pedidos/:pedidoId/pedir-novamente:
 *   get:
 *     summary: Recuperar itens do pedido para pedir novamente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itens recuperados
 */
router.get('/pedidos/:pedidoId/pedir-novamente', avaliacaoController.pedirNovamente);

export { router };