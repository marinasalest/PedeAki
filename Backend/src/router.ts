import { Router } from 'express'
import multer from 'multer'

import { CreateUsuarioController } from './controllers/usuario/CreateUsuarioController'
import { AuthUsuarioController } from './controllers/usuario/AuthUsuarioController'
import UsuarioController from './controllers/usuario/UsuarioController'
import UpdateUsuarioController from './controllers/usuario/UpdateUsuarioController'
import DeleteUsuarioController from './controllers/usuario/DeleteUsuarioController'

import  EnderecoController from './controllers/endereco/EnderecoController'
import  ReadEnderecoController from './controllers/endereco/ReadEnderecoController'
import  UpdateEnderecoController from './controllers/endereco/UpdateEnderecoController'
import DeleteEnderecoController from './controllers/endereco/DeleteEnderecoController'

import CreateCategoriaController from './controllers/categoria/CreateCategoriaController'
import CategoriaController from './controllers/categoria/CategoriaController'
import UpdateCategoriaController from './controllers/categoria/UpdateCategoriaController'
import DeleteCategoriaController from './controllers/categoria/DeleteCategoriaController'

import CreateRestauranteController from './controllers/restaurante/CreateRestauranteController'
import RestauranteController from './controllers/restaurante/RestauranteController'

import CreateProdutosController from './controllers/produto/CreateProdutosController'

import uploadConfig from './config/multer'

const router = Router();
const storage = uploadConfig.upload('./tmp').Storage;
const upload = multer({ storage });

const createUsuarioController = new CreateUsuarioController();
const authUsuarioController = new AuthUsuarioController();
const usuarioController = new UsuarioController;
const updateUsuarioController = new UpdateUsuarioController();
const deleteUsuarioController = new DeleteUsuarioController();

const enderecoController = new EnderecoController;
const readEnderecoController = new ReadEnderecoController;
const updateEnderecoController = new UpdateEnderecoController;
const deleteEnderecoController = new DeleteEnderecoController;

const createCategoriaController = new CreateCategoriaController;
const categoriaController = new CategoriaController;
const updateCategoriaController = new UpdateCategoriaController;
const deleteCategoriaController = new DeleteCategoriaController;

const createRestauranteController = new CreateRestauranteController;
const restauranteController = new RestauranteController;

const createProdutosController = new CreateProdutosController;

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Usuários]
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
 *                 example: "João Silva"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *               enderecoId:
 *                 type: string
 *                 format: uuid
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
 *     summary: Autenticar usuário
 *     tags: [Usuários]
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
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
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
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Endereco'
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

export { router };