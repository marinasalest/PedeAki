import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PedeAki API',
      version: '1.0.0',
      description: `# Pede Aki

## Introdução
É um aplicativo de delivery que tem como objetivo entrar para o mercado de serviços de entrega de alimentos fastfood no Brasil, trazendo facilidade e comodidade aos clientes.

## Funcionalidades e Regras de Negócio

### 2.1. Módulo de Autenticação

**Funcionalidades:**
- Cadastro de usuários com validação de dados pessoais
- Login com email e senha
- Autenticação via redes sociais (Facebook/Gmail)
- Recuperação de senha
- Validação de CPF único
- Validação de email único
- Criptografia de senhas com bcrypt

**Regras de Negócio:**
- Usuário deve ter pelo menos 18 anos
- CPF deve ser válido e único no sistema
- Email deve ser válido e único no sistema
- Senha deve ter mínimo 6 caracteres
- Endereço é obrigatório para cadastro
- Sessão expira após 24 horas de inatividade

### 2.2. Módulo de Solicitação de Pedidos

#### 2.2.1. Escolha do Restaurante

**Regras de Negócio:**
- Usuário só vê restaurantes que estão até no máximo 10 km do seu endereço
- Restaurantes que entregam no CEP informado
- Restaurantes que estão abertos
- Restaurantes podem desabilitar itens sem estoque
- Restaurantes podem aumentar o tempo estimado em horários de pico
- Decidir valor mínimo de pedido para usuário poder concluir a compra

#### 2.2.2. Acesso ao Cardápio

**Regras de Negócio:**
- O usuário somente pode visualizar o cardápio de restaurantes abertos e que atendem ao seu endereço de entrega
- Produtos com indisponibilidade de estoque devem aparecer bloqueados e não podem ser adicionados ao carrinho
- Itens com horário específico de funcionamento só ficam visíveis ou habilitados dentro do período configurado
- Opções adicionais seguem preços definidos pelo restaurante e são obrigatoriamente somadas ao valor do produto
- A quantidade máxima de um item depende do limite estabelecido pelo restaurante
- Produtos devem exibir obrigatoriamente: nome, preço e categoria; descrição e imagem são opcionais

#### 2.2.3. Carrinho de Compras

**Regras de Negócio:**
- Valor mínimo obrigatório para finalizar
- Cupom de desconto só pode ser usado uma vez por usuário
- Cupom pode ser exclusivo para determinados restaurantes
- Itens adicionados expiram após 30 min se não houver finalização

#### 2.2.4. Endereço e Entrega

**Regras de Negócio:**
- Se o entregador não conseguir realizar entrega, sistema cria status "Tentativa de entrega falhou"
- Pedido é considerado entregue quando entregador confirma e sistema registra geolocalização final

#### 2.2.5. Pagamento

**Regras de Negócio:**
- Pedido só é enviado ao restaurante após aprovação financeira
- Pagamento com Pix tem tempo de expiração (ex.: 10 min)
- Se o pagamento falhar, o pedido é automaticamente cancelado

#### 2.2.6. Confirmação do Pedido

**Regras de Negócio:**
- Entregador só é atribuído após restaurante mudar status para Preparando
- Usuário pode alterar endereço somente enquanto o pedido está pendente
- Cancelar pedido apenas em: Pendente ou Confirmado (se restaurante permitir)
- Restaurante pode recusar pedido quando: fora do horário, itens sem estoque, endereço inseguro

#### 2.2.7. Acompanhamento em Tempo Real

**Regras de Negócio:**
- Fluxo de status: Pendente → Confirmado → Preparando → Aguardando Entregador → Em Rota → Entregue
- O usuário só recebe atualizações em tempo real após o pedido ser Confirmado pelo restaurante
- O status Aguardando Entregador é obrigatório antes de definir o entregador responsável
- O entregador só pode iniciar o status Em Rota após retirar o pedido no restaurante
- Mudanças de status devem gerar notificações push para o usuário
- O pedido só pode ser marcado como Entregue após confirmação do entregador

#### 2.2.8. Finalização do Pedido

**Regras de Negócio:**
- Após o status Entregue, o sistema deve obrigatoriamente solicitar avaliação do usuário
- O usuário só pode avaliar o restaurante uma vez por pedido
- Denúncias só podem ser abertas após a finalização do pedido
- Cancelamentos não são permitidos após o pedido estar marcado como Entregue`,
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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /login'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          required: ['name', 'cpf', 'data_nascimento', 'email', 'password', 'enderecoId'],
          description: 'Modelo de dados do usuário do sistema',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário (gerado automaticamente)',
              readOnly: true
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Nome completo do usuário',
              example: 'João Silva'
            },
            cpf: {
              type: 'string',
              pattern: '^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}$',
              description: 'CPF do usuário no formato XXX.XXX.XXX-XX. Deve ser único no sistema e válido.',
              example: '123.456.789-00'
            },
            data_nascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento no formato YYYY-MM-DD. Usuário deve ter pelo menos 18 anos.',
              example: '1990-01-01'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Email do usuário. Deve ser válido e único no sistema.',
              example: 'joao@email.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Senha do usuário. Mínimo 6 caracteres. Será criptografada com bcrypt.',
              example: 'senha123'
            },
            enderecoId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do endereço cadastrado. Endereço é obrigatório para cadastro.',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            provider: {
              type: 'string',
              enum: ['local', 'facebook', 'google'],
              description: 'Provedor de autenticação. Padrão: "local"',
              example: 'local'
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
          required: ['name', 'cnpj', 'nome_fantasia', 'senha', 'telefone', 'email', 'id_endereco', 'id_categoria'],
          description: 'Modelo de dados do restaurante',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do restaurante (gerado automaticamente)',
              readOnly: true
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Nome do restaurante (obrigatório, mínimo 3 caracteres, máximo 100)',
              example: 'Restaurante do João'
            },
            cnpj: {
              type: 'string',
              pattern: '^[0-9]{2}\\.[0-9]{3}\\.[0-9]{3}/[0-9]{4}-[0-9]{2}$',
              description: 'CNPJ do restaurante no formato XX.XXX.XXX/XXXX-XX (obrigatório, deve ser único)',
              example: '12.345.678/0001-95'
            },
            nome_fantasia: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Nome fantasia do restaurante (obrigatório, mínimo 3 caracteres, máximo 100)',
              example: 'João Delivery'
            },
            senha: {
              type: 'string',
              minLength: 6,
              description: 'Senha do restaurante (obrigatório, mínimo 6 caracteres, será criptografada)',
              example: 'senha123'
            },
            telefone: {
              type: 'string',
              pattern: '^[0-9]{10,11}$',
              description: 'Telefone de contato no formato DDD + número (obrigatório, 10 ou 11 dígitos)',
              example: '11984526945'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Email do restaurante (obrigatório, deve ser válido e único)',
              example: 'contato@restaurante.com'
            },
            avaliacao: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Média de avaliações (0 a 5). Calculada automaticamente.',
              example: 4.5
            },
            id_endereco: {
              type: 'string',
              format: 'uuid',
              description: 'ID do endereço do restaurante (obrigatório, endereço deve existir)',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            id_categoria: {
              type: 'string',
              description: 'ID da categoria do restaurante (obrigatório, categoria deve existir)',
              example: 'LANCHES'
            },
            ativo: {
              type: 'boolean',
              description: 'Indica se o restaurante está ativo e aparece nas buscas',
              default: true
            },
            valor_minimo_pedido: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor mínimo obrigatório para finalizar pedido',
              example: 20.00
            },
            taxa_entrega: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Taxa de entrega padrão',
              example: 5.00
            },
            entrega_gratis: {
              type: 'boolean',
              description: 'Indica se oferece entrega grátis',
              default: false
            },
            valor_minimo_entrega_gratis: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor mínimo do pedido para ter entrega grátis',
              example: 50.00
            },
            tempo_medio_preparo: {
              type: 'integer',
              minimum: 0,
              description: 'Tempo médio de preparo em minutos',
              example: 30
            },
            tempo_medio_entrega: {
              type: 'integer',
              minimum: 0,
              description: 'Tempo médio de entrega em minutos',
              example: 25
            }
          }
        },
        Produto: {
          type: 'object',
          required: ['name_produto', 'preco', 'id_restaurante', 'id_categoria'],
          description: 'Modelo de dados do produto do cardápio',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do produto (gerado automaticamente)',
              readOnly: true
            },
            name_produto: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Nome do produto (obrigatório, mínimo 3 caracteres, máximo 100)',
              example: 'Hambúrguer Clássico'
            },
            preco: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Preço do produto (obrigatório, deve ser maior ou igual a 0)',
              example: 25.90
            },
            imagem: {
              type: 'string',
              description: 'URL ou nome do arquivo da imagem do produto (opcional)',
              nullable: true,
              example: 'hamburguer-classico.jpg'
            },
            descricao: {
              type: 'string',
              maxLength: 500,
              description: 'Descrição do produto (opcional, máximo 500 caracteres)',
              nullable: true,
              example: 'Hambúrguer com carne, queijo, alface e tomate'
            },
            ingredientes: {
              type: 'string',
              maxLength: 500,
              description: 'Lista de ingredientes (opcional)',
              nullable: true
            },
            alergenicos: {
              type: 'string',
              maxLength: 200,
              description: 'Informações sobre alérgenos (opcional)',
              nullable: true
            },
            tempo_preparo: {
              type: 'integer',
              minimum: 0,
              description: 'Tempo de preparo estimado em minutos (opcional)',
              nullable: true,
              example: 15
            },
            estoque: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque. null = ilimitado (opcional)',
              nullable: true,
              example: 50
            },
            quantidade_maxima_pedido: {
              type: 'integer',
              minimum: 1,
              description: 'Quantidade máxima permitida por pedido (opcional)',
              nullable: true,
              example: 5
            },
            disponivel: {
              type: 'boolean',
              description: 'Indica se o produto está disponível para venda',
              default: true
            },
            horario_inicio: {
              type: 'string',
              pattern: '^[0-9]{2}:[0-9]{2}$',
              description: 'Horário de início de disponibilidade no formato HH:MM (opcional)',
              nullable: true,
              example: '11:00'
            },
            horario_fim: {
              type: 'string',
              pattern: '^[0-9]{2}:[0-9]{2}$',
              description: 'Horário de fim de disponibilidade no formato HH:MM (opcional)',
              nullable: true,
              example: '15:00'
            },
            permite_personalizacao: {
              type: 'boolean',
              description: 'Indica se o produto permite personalização de ingredientes',
              default: false
            },
            ativo: {
              type: 'boolean',
              description: 'Indica se o produto está ativo e aparece no cardápio',
              default: true
            },
            id_restaurante: {
              type: 'string',
              format: 'uuid',
              description: 'ID do restaurante (obrigatório, restaurante deve existir)',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            id_categoria: {
              type: 'string',
              description: 'ID da categoria (obrigatório, categoria deve existir)',
              example: 'LANCHES'
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
          required: ['id_restaurante', 'id_usuario', 'id_endereco'],
          description: 'Modelo de dados do pedido',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do pedido (gerado automaticamente)',
              readOnly: true
            },
            data_pedido: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de criação do pedido (gerado automaticamente)',
              readOnly: true
            },
            subtotal: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Subtotal dos itens do pedido (sem taxa de entrega e desconto)',
              example: 45.90
            },
            taxa_entrega: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Taxa de entrega. Zero se for retirada ou se houver entrega grátis.',
              example: 5.00
            },
            desconto: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor do desconto aplicado (cupom ou promoção)',
              example: 4.59
            },
            total: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor total do pedido (subtotal + taxa_entrega - desconto)',
              example: 46.31
            },
            observacoes: {
              type: 'string',
              maxLength: 500,
              description: 'Observações gerais do pedido (opcional)',
              example: 'Bem passado, sem pimenta'
            },
            status: {
              type: 'string',
              enum: ['PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'AGUARDANDO_ENTREGADOR', 'EM_ROTA', 'ENTREGUE', 'CANCELADO', 'TENTATIVA_FALHOU', 'RECUSADO'],
              description: 'Status atual do pedido. Fluxo: PENDENTE → CONFIRMADO → PREPARANDO → AGUARDANDO_ENTREGADOR → EM_ROTA → ENTREGUE',
              example: 'CONFIRMADO'
            },
            tipo_entrega: {
              type: 'string',
              enum: ['retirada', 'padrao', 'express'],
              description: 'Tipo de entrega: retirada (no local), padrao (entrega padrão), express (entrega prioritária)',
              example: 'padrao'
            },
            tempo_estimado_preparo: {
              type: 'integer',
              minimum: 0,
              description: 'Tempo estimado de preparo em minutos',
              example: 30
            },
            tempo_estimado_entrega: {
              type: 'integer',
              minimum: 0,
              description: 'Tempo estimado de entrega em minutos (zero se for retirada)',
              example: 25
            },
            tempo_total_estimado: {
              type: 'integer',
              minimum: 0,
              description: 'Tempo total estimado (preparo + entrega) em minutos',
              example: 55
            },
            id_restaurante: {
              type: 'string',
              format: 'uuid',
              description: 'ID do restaurante (obrigatório)',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            id_usuario: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário que fez o pedido (obrigatório)',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            id_endereco: {
              type: 'string',
              format: 'uuid',
              description: 'ID do endereço de entrega (obrigatório)',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            id_cupom: {
              type: 'string',
              format: 'uuid',
              description: 'ID do cupom aplicado (opcional)',
              nullable: true
            },
            valor_troco: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor do troco necessário (apenas para pagamento em dinheiro)',
              nullable: true,
              example: 10.00
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
  apis: [
    resolve(__dirname, '..', 'router.ts'),
    resolve(__dirname, '..', 'controllers', '**', '*.ts')
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
