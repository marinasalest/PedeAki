import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PedeAki API',
      version: '1.0.0',
      description: 'API para o sistema de delivery de comida PedeAki',
      contact: {
        name: 'Marina Sales',
        email: 'marina@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          required: ['name', 'cpf', 'data_nascimento', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário'
            },
            cpf: {
              type: 'string',
              description: 'CPF do usuário'
            },
            data_nascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário'
            },
            id_endereco: {
              type: 'string',
              format: 'uuid',
              description: 'ID do endereço'
            }
          }
        },
        Endereco: {
          type: 'object',
          required: ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do endereço'
            },
            rua: {
              type: 'string',
              description: 'Nome da rua'
            },
            numero: {
              type: 'string',
              description: 'Número do endereço'
            },
            complemento: {
              type: 'string',
              description: 'Complemento do endereço'
            },
            bairro: {
              type: 'string',
              description: 'Nome do bairro'
            },
            cidade: {
              type: 'string',
              description: 'Nome da cidade'
            },
            estado: {
              type: 'string',
              description: 'Sigla do estado'
            },
            cep: {
              type: 'string',
              description: 'CEP do endereço'
            }
          }
        },
        Restaurante: {
          type: 'object',
          required: ['name', 'cnpj', 'nome_fantasia', 'senha', 'telefone', 'email'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do restaurante'
            },
            name: {
              type: 'string',
              description: 'Nome do restaurante'
            },
            cnpj: {
              type: 'string',
              description: 'CNPJ do restaurante'
            },
            nome_fantasia: {
              type: 'string',
              description: 'Nome fantasia do restaurante'
            },
            senha: {
              type: 'string',
              description: 'Senha do restaurante'
            },
            telefone: {
              type: 'string',
              description: 'Telefone de contato'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do restaurante'
            },
            avaliacao: {
              type: 'number',
              format: 'float',
              description: 'Média de avaliações'
            },
            id_endereco: {
              type: 'string',
              format: 'uuid',
              description: 'ID do endereço'
            }
          }
        },
        Produto: {
          type: 'object',
          required: ['name_produto', 'preco', 'id_restaurante', 'id_categoria'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do produto'
            },
            name_produto: {
              type: 'string',
              description: 'Nome do produto'
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço do produto'
            },
            imagem: {
              type: 'string',
              description: 'URL da imagem do produto'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do produto'
            },
            id_restaurante: {
              type: 'string',
              format: 'uuid',
              description: 'ID do restaurante'
            },
            id_categoria: {
              type: 'string',
              description: 'ID da categoria'
            }
          }
        },
        Categoria: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único da categoria'
            },
            name: {
              type: 'string',
              description: 'Nome da categoria'
            }
          }
        },
        Pedido: {
          type: 'object',
          required: ['quantidade', 'total', 'id_restaurante', 'id_produto', 'id_usuario'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do pedido'
            },
            data_pedido: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do pedido'
            },
            quantidade: {
              type: 'integer',
              description: 'Quantidade do produto'
            },
            total: {
              type: 'number',
              format: 'float',
              description: 'Valor total do pedido'
            },
            descricao: {
              type: 'string',
              description: 'Observações do pedido'
            },
            status: {
              type: 'string',
              enum: ['PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'SAIU_PARA_ENTREGA', 'ENTREGUE'],
              description: 'Status do pedido'
            },
            id_restaurante: {
              type: 'string',
              format: 'uuid',
              description: 'ID do restaurante'
            },
            id_produto: {
              type: 'string',
              format: 'uuid',
              description: 'ID do produto'
            },
            id_usuario: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            error: {
              type: 'string',
              description: 'Detalhes do erro'
            }
          }
        }
      }
    }
  },
  apis: ['./src/router.ts', './src/controllers/**/*.ts']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
