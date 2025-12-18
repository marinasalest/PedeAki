# 4. Modelo de Dados Físico - Pede Aki

## 4.1. Enderecos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do endereço |
| `rua` | VARCHAR | 200 | NOT NULL | Nome da rua ou logradouro |
| `numero` | VARCHAR | 20 | NOT NULL | Número do endereço |
| `complemento` | VARCHAR | 100 | NULL | Complemento do endereço |
| `bairro` | VARCHAR | 100 | NOT NULL | Nome do bairro |
| `cidade` | VARCHAR | 100 | NOT NULL | Nome da cidade |
| `estado` | VARCHAR | 50 | NOT NULL | Nome completo ou sigla do estado |
| `cep` | VARCHAR | 8 | NOT NULL | CEP do endereço (8 dígitos sem hífen) |
| `latitude` | FLOAT | - | NULL | Latitude do endereço (opcional) |
| `longitude` | FLOAT | - | NULL | Longitude do endereço (opcional) |

---

## 4.2. Usuarios

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do usuário |
| `name` | VARCHAR | 100 | NOT NULL | Nome completo do usuário |
| `cpf` | VARCHAR | 14 | UNIQUE, NULL | CPF do usuário (formato XXX.XXX.XXX-XX) |
| `data_nascimento` | DATE | - | NULL | Data de nascimento do usuário |
| `email` | VARCHAR | 255 | UNIQUE, NOT NULL | Email do usuário (único) |
| `password` | VARCHAR | 255 | NULL | Senha criptografada (nulo para social login) |
| `facebook_id` | VARCHAR | 255 | UNIQUE, NULL | ID do usuário no Facebook |
| `google_id` | VARCHAR | 255 | UNIQUE, NULL | ID do usuário no Google |
| `provider` | VARCHAR | 50 | NULL | Provedor de autenticação ('local', 'facebook', 'google') |
| `id_endereco` | UUID | 36 | FK, NULL | Referência ao endereço padrão do usuário |
| `saldo_carteira` | DECIMAL | 10,2 | NOT NULL, DEFAULT 0 | Saldo da carteira digital do usuário |

---

## 4.3. Categorias

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | VARCHAR | 50 | PK, NOT NULL | Identificador único da categoria |
| `name` | VARCHAR | 100 | NOT NULL | Nome da categoria (ex: 'LANCHES', 'PIZZA', 'SUSHI') |

---

## 4.4. Restaurantes

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do restaurante |
| `name` | VARCHAR | 100 | NOT NULL | Nome do restaurante |
| `cnpj` | VARCHAR | 18 | UNIQUE, NOT NULL | CNPJ do restaurante (formato XX.XXX.XXX/XXXX-XX) |
| `nome_fantasia` | VARCHAR | 100 | NOT NULL | Nome fantasia do restaurante |
| `senha` | VARCHAR | 255 | NOT NULL | Senha criptografada para acesso ao painel |
| `telefone` | VARCHAR | 20 | NULL | Telefone de contato do restaurante |
| `email` | VARCHAR | 255 | UNIQUE, NOT NULL | Email do restaurante (único) |
| `avaliacao` | DECIMAL | 3,2 | NOT NULL, DEFAULT 0.0 | Média de avaliações (0.00 a 5.00) |
| `foto` | VARCHAR | 255 | NULL | URL ou nome do arquivo da foto do restaurante |
| `taxa_entrega` | DECIMAL | 10,2 | NOT NULL, DEFAULT 0 | Taxa de entrega cobrada |
| `tempo_medio_preparo` | INT | - | NOT NULL, DEFAULT 30 | Tempo médio de preparo em minutos |
| `tempo_medio_entrega` | INT | - | NOT NULL, DEFAULT 30 | Tempo médio de entrega em minutos |
| `valor_minimo_pedido` | DECIMAL | 10,2 | NOT NULL, DEFAULT 0 | Valor mínimo para concluir pedido |
| `entrega_gratis` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | Indica se oferece entrega grátis |
| `valor_minimo_entrega_gratis` | DECIMAL | 10,2 | NULL | Valor mínimo do pedido para ter entrega grátis |
| `tipo_entrega` | VARCHAR | 50 | NOT NULL, DEFAULT 'propria' | Tipo de entrega ('propria' ou 'terceiros') |
| `aberto` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | Indica se o restaurante está aberto |
| `horario_abertura` | VARCHAR | 5 | NULL | Horário de abertura (formato HH:MM) |
| `horario_fechamento` | VARCHAR | 5 | NULL | Horário de fechamento (formato HH:MM) |
| `dias_funcionamento` | VARCHAR | 100 | NULL | Dias de funcionamento (separados por vírgula) |
| `raio_entrega` | DECIMAL | 10,2 | NOT NULL, DEFAULT 10 | Raio de entrega em km |
| `ceps_atendidos` | VARCHAR | 500 | NULL | Lista de CEPs atendidos (separados por vírgula) |
| `ativo` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | Indica se o restaurante está ativo |
| `id_endereco` | UUID | 36 | FK, NOT NULL | Referência ao endereço do restaurante |
| `id_categoria` | VARCHAR | 50 | FK, NOT NULL | Referência à categoria do restaurante |

---

## 4.5. Produtos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do produto |
| `name_produto` | VARCHAR | 100 | NOT NULL | Nome do produto |
| `preco` | DECIMAL | 10,2 | NOT NULL | Preço do produto |
| `imagem` | VARCHAR | 255 | NULL | URL ou nome do arquivo da imagem |
| `descricao` | VARCHAR | 500 | NULL | Descrição do produto |
| `ingredientes` | VARCHAR | 500 | NULL | Lista de ingredientes |
| `alergenicos` | VARCHAR | 200 | NULL | Informações sobre alérgenos |
| `tempo_preparo` | INT | - | NULL | Tempo de preparo em minutos |
| `estoque` | INT | - | NULL | Quantidade em estoque (null = ilimitado) |
| `quantidade_maxima_pedido` | INT | - | NULL | Quantidade máxima permitida por pedido |
| `disponivel` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | Indica se o produto está disponível |
| `horario_inicio` | VARCHAR | 5 | NULL | Horário de início de disponibilidade (HH:MM) |
| `horario_fim` | VARCHAR | 5 | NULL | Horário de fim de disponibilidade (HH:MM) |
| `permite_personalizacao` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | Permite personalização de ingredientes |
| `ativo` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | Indica se o produto está ativo |
| `id_restaurante` | UUID | 36 | FK, NOT NULL | Referência ao restaurante |
| `id_categoria` | VARCHAR | 50 | FK, NOT NULL | Referência à categoria do produto |

---

## 4.6. Pedidos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do pedido |
| `data_pedido` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora de criação do pedido |
| `subtotal` | DECIMAL | 10,2 | NOT NULL | Subtotal dos itens (sem taxa e desconto) |
| `taxa_entrega` | DECIMAL | 10,2 | NOT NULL | Valor da taxa de entrega |
| `desconto` | DECIMAL | 10,2 | NOT NULL, DEFAULT 0 | Valor do desconto aplicado |
| `total` | DECIMAL | 10,2 | NOT NULL | Valor total do pedido |
| `observacoes` | VARCHAR | 500 | NULL | Observações gerais do pedido |
| `status` | VARCHAR | 50 | NOT NULL, DEFAULT 'PENDENTE' | Status do pedido (PENDENTE, CONFIRMADO, PREPARANDO, AGUARDANDO_ENTREGADOR, EM_ROTA, ENTREGUE, CANCELADO, TENTATIVA_FALHOU, RECUSADO) |
| `tempo_estimado_preparo` | INT | - | NULL | Tempo estimado de preparo em minutos |
| `tempo_estimado_entrega` | INT | - | NULL | Tempo estimado de entrega em minutos |
| `tempo_total_estimado` | INT | - | NULL | Tempo total estimado em minutos |
| `tipo_entrega` | VARCHAR | 50 | NOT NULL, DEFAULT 'padrao' | Tipo de entrega ('padrao', 'prioritaria', 'retirada') |
| `valor_troco` | DECIMAL | 10,2 | NULL | Valor do troco (se pagamento em dinheiro) |
| `latitude_entrega` | FLOAT | - | NULL | Latitude do endereço de entrega |
| `longitude_entrega` | FLOAT | - | NULL | Longitude do endereço de entrega |
| `data_confirmacao` | TIMESTAMP | - | NULL | Data e hora da confirmação |
| `data_preparando` | TIMESTAMP | - | NULL | Data e hora do início do preparo |
| `data_saiu_entrega` | TIMESTAMP | - | NULL | Data e hora que saiu para entrega |
| `data_em_rota` | TIMESTAMP | - | NULL | Data e hora que entrou em rota |
| `data_entregue` | TIMESTAMP | - | NULL | Data e hora da entrega |
| `data_cancelado` | TIMESTAMP | - | NULL | Data e hora do cancelamento |
| `motivo_cancelamento` | VARCHAR | 500 | NULL | Motivo do cancelamento |
| `id_restaurante` | UUID | 36 | FK, NOT NULL | Referência ao restaurante |
| `id_usuario` | UUID | 36 | FK, NOT NULL | Referência ao usuário |
| `id_endereco` | UUID | 36 | FK, NOT NULL | Referência ao endereço de entrega |
| `id_cupom` | UUID | 36 | FK, NULL | Referência ao cupom aplicado |

---

## 4.7. ItensPedido

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do item |
| `quantidade` | INT | - | NOT NULL | Quantidade do produto |
| `preco_unitario` | DECIMAL | 10,2 | NOT NULL | Preço unitário no momento do pedido |
| `subtotal` | DECIMAL | 10,2 | NOT NULL | Subtotal (quantidade × preco_unitario) |
| `observacoes` | VARCHAR | 500 | NULL | Observações específicas do item |
| `personalizacoes` | VARCHAR | 1000 | NULL | JSON com personalizações do item |
| `id_pedido` | UUID | 36 | FK, NOT NULL | Referência ao pedido |
| `id_produto` | UUID | 36 | FK, NOT NULL | Referência ao produto |

---

## 4.8. Avaliacoes

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único da avaliação |
| `nota` | INT | - | NOT NULL | Nota da avaliação (1 a 5) |
| `comentario` | VARCHAR | 1000 | NULL | Comentário da avaliação |
| `denuncia` | VARCHAR | 1000 | NULL | Motivo da denúncia (se houver) |
| `data_avaliacao` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora da avaliação |
| `id_restaurante` | UUID | 36 | FK, NOT NULL | Referência ao restaurante avaliado |
| `id_pedido` | UUID | 36 | FK, UNIQUE, NOT NULL | Referência ao pedido avaliado (único) |

---

## 4.9. Pagamentos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do pagamento |
| `forma_pagamento` | VARCHAR | 50 | NOT NULL | Forma de pagamento ('credito', 'debito', 'pix', 'dinheiro', 'carteira') |
| `numero_cartao` | VARCHAR | 4 | NULL | Últimos 4 dígitos do cartão (se aplicável) |
| `nome_titular` | VARCHAR | 100 | NULL | Nome do titular do cartão |
| `validade_cartao` | VARCHAR | 7 | NULL | Validade do cartão (MM/YYYY) |
| `cvv` | VARCHAR | 3 | NULL | CVV do cartão (não deve ser armazenado em produção) |
| `qr_code_pix` | VARCHAR | 500 | NULL | QR Code do PIX (se aplicável) |
| `pix_expira_em` | TIMESTAMP | - | NULL | Data e hora de expiração do PIX |
| `valor` | DECIMAL | 10,2 | NOT NULL | Valor do pagamento |
| `status` | VARCHAR | 50 | NOT NULL, DEFAULT 'PENDENTE' | Status do pagamento (PENDENTE, APROVADO, RECUSADO, EXPIRADO) |
| `data_aprovacao` | TIMESTAMP | - | NULL | Data e hora da aprovação |
| `saldo_carteira_usado` | DECIMAL | 10,2 | NOT NULL, DEFAULT 0 | Valor usado do saldo da carteira |
| `id_usuario` | UUID | 36 | FK, NOT NULL | Referência ao usuário |
| `id_pedido` | UUID | 36 | FK, UNIQUE, NOT NULL | Referência ao pedido (único) |

---

## 4.10. CartoesSalvos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do cartão salvo |
| `numero_cartao` | VARCHAR | 4 | NOT NULL | Últimos 4 dígitos do cartão |
| `nome_titular` | VARCHAR | 100 | NOT NULL | Nome do titular do cartão |
| `validade_cartao` | VARCHAR | 7 | NOT NULL | Validade do cartão (MM/AA) |
| `bandeira` | VARCHAR | 50 | NOT NULL | Bandeira do cartão ('Visa', 'Mastercard', 'Elo', etc.) |
| `tipo` | VARCHAR | 50 | NOT NULL | Tipo do cartão ('credito' ou 'debito') |
| `padrao` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | Indica se é o cartão padrão do usuário |
| `data_criacao` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora de criação |
| `id_usuario` | UUID | 36 | FK, NOT NULL | Referência ao usuário |

---

## 4.11. Carrinho

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do carrinho |
| `data_criacao` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora de criação |
| `data_expiracao` | TIMESTAMP | - | NOT NULL | Data e hora de expiração (30 minutos após criação) |
| `itens` | TEXT | - | NOT NULL | JSON com itens do carrinho |
| `id_usuario` | UUID | 36 | FK, NOT NULL | Referência ao usuário |

---

## 4.12. Cupons

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do cupom |
| `codigo` | VARCHAR | 50 | UNIQUE, NOT NULL | Código do cupom |
| `descricao` | VARCHAR | 500 | NULL | Descrição do cupom |
| `tipo_desconto` | VARCHAR | 50 | NOT NULL | Tipo de desconto ('percentual' ou 'valor_fixo') |
| `valor_desconto` | DECIMAL | 10,2 | NOT NULL | Valor do desconto |
| `valor_minimo_pedido` | DECIMAL | 10,2 | NULL | Valor mínimo do pedido para usar o cupom |
| `data_inicio` | TIMESTAMP | - | NOT NULL | Data de início da validade |
| `data_fim` | TIMESTAMP | - | NOT NULL | Data de fim da validade |
| `uso_maximo` | INT | - | NULL | Uso máximo permitido (null = ilimitado) |
| `uso_atual` | INT | - | NOT NULL, DEFAULT 0 | Quantidade de vezes já usado |
| `ativo` | BOOLEAN | - | NOT NULL, DEFAULT TRUE | Indica se o cupom está ativo |
| `exclusivo_restaurante` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | Indica se é exclusivo de um restaurante |
| `id_restaurante` | UUID | 36 | FK, NULL | Referência ao restaurante (se exclusivo) |

---

## 4.13. UsoCupons

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do registro |
| `data_uso` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora do uso |
| `id_usuario` | UUID | 36 | FK, NOT NULL | Referência ao usuário |
| `id_cupom` | UUID | 36 | FK, NOT NULL | Referência ao cupom |
| **UNIQUE** | - | - | (id_usuario, id_cupom) | Garante que um usuário só pode usar um cupom uma vez |

---

## 4.14. HistoricoStatus

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do registro |
| `status_anterior` | VARCHAR | 50 | NULL | Status anterior do pedido |
| `status_novo` | VARCHAR | 50 | NOT NULL | Novo status do pedido |
| `data_mudanca` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora da mudança |
| `observacoes` | VARCHAR | 500 | NULL | Observações sobre a mudança |
| `id_pedido` | UUID | 36 | FK, NOT NULL | Referência ao pedido |

---

## 4.15. OpcoesProduto

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único da opção |
| `nome` | VARCHAR | 100 | NOT NULL | Nome da opção |
| `tipo` | VARCHAR | 50 | NOT NULL | Tipo da opção ('adicional', 'tamanho', 'remocao') |
| `preco` | DECIMAL | 10,2 | NOT NULL, DEFAULT 0 | Preço adicional da opção |
| `obrigatorio` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | Indica se a opção é obrigatória |
| `id_produto` | UUID | 36 | FK, NOT NULL | Referência ao produto |

---

## 4.16. CodigosVerificacao

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| `id` | UUID | 36 | PK, NOT NULL | Identificador único do código |
| `tipo` | VARCHAR | 50 | NOT NULL | Tipo de verificação ('email', 'sms', 'whatsapp') |
| `destino` | VARCHAR | 255 | NOT NULL | Email, telefone ou número WhatsApp |
| `codigo_6_digitos` | VARCHAR | 6 | NOT NULL | Código de 6 dígitos |
| `usado` | BOOLEAN | - | NOT NULL, DEFAULT FALSE | Indica se o código já foi usado |
| `data_criacao` | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data e hora de criação |
| `data_expiracao` | TIMESTAMP | - | NOT NULL | Data e hora de expiração (10 minutos após criação) |
| `tentativas` | INT | - | NOT NULL, DEFAULT 0 | Número de tentativas de uso |
| `max_tentativas` | INT | - | NOT NULL, DEFAULT 3 | Número máximo de tentativas permitidas |
