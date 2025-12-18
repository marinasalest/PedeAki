# Modelo Físico de Dados - Sistema PedeAki

## 1. Tabela: enderecos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do endereço |
| rua | VARCHAR | - | NOT NULL | Nome da rua |
| numero | VARCHAR | - | NOT NULL | Número do endereço |
| complemento | VARCHAR | - | NOT NULL | Complemento do endereço |
| bairro | VARCHAR | - | NOT NULL | Nome do bairro |
| cidade | VARCHAR | - | NOT NULL | Nome da cidade |
| estado | VARCHAR | - | NOT NULL | Estado (UF) |
| cep | VARCHAR | - | NOT NULL | CEP do endereço |
| latitude | DOUBLE PRECISION | - | NULL | Latitude para cálculo de distância |
| longitude | DOUBLE PRECISION | - | NULL | Longitude para cálculo de distância |

**Relacionamentos:**
- Um endereço pode ter vários usuários (1:N)
- Um endereço pode ter vários restaurantes (1:N)
- Um endereço pode ter vários pedidos (1:N)

---

## 2. Tabela: usuarios

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do usuário |
| name | VARCHAR | - | NOT NULL | Nome completo do usuário |
| cpf | VARCHAR | - | NULL, UNIQUE | CPF do usuário (opcional para OAuth) |
| data_nascimento | TIMESTAMP | - | NULL | Data de nascimento |
| email | VARCHAR | - | NOT NULL, UNIQUE | Email do usuário |
| password | VARCHAR | - | NULL | Senha criptografada (opcional para OAuth) |
| facebook_id | VARCHAR | - | NULL, UNIQUE | ID do Facebook (OAuth) |
| google_id | VARCHAR | - | NULL, UNIQUE | ID do Google (OAuth) |
| provider | VARCHAR | - | NULL | Provedor de autenticação ('facebook', 'google', 'local') |
| id_endereco | UUID | - | NULL, FK(enderecos.id) | Endereço principal do usuário |
| saldo_carteira | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Saldo da carteira digital |

**Relacionamentos:**
- Um usuário tem um endereço principal (N:1)
- Um usuário pode ter vários pedidos (1:N)
- Um usuário pode ter vários pagamentos (1:N)
- Um usuário pode ter vários carrinhos (1:N)
- Um usuário pode usar vários cupons (N:M via uso_cupons)

---

## 3. Tabela: restaurantes

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do restaurante |
| name | VARCHAR | - | NOT NULL | Nome do restaurante |
| cnpj | VARCHAR | - | NOT NULL | CNPJ do restaurante |
| nome_fantasia | VARCHAR | - | NOT NULL | Nome fantasia |
| senha | VARCHAR | - | NOT NULL | Senha do restaurante |
| telefone | VARCHAR | - | NOT NULL | Telefone de contato |
| email | VARCHAR | - | NOT NULL | Email do restaurante |
| avaliacao | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Média de avaliações (0-5) |
| foto | VARCHAR | - | NULL | URL da foto do restaurante |
| taxa_entrega | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Taxa de entrega em reais |
| tempo_medio_preparo | INTEGER | - | NOT NULL, DEFAULT 30 | Tempo médio de preparo (minutos) |
| tempo_medio_entrega | INTEGER | - | NOT NULL, DEFAULT 30 | Tempo médio de entrega (minutos) |
| valor_minimo_pedido | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Valor mínimo para pedido |
| entrega_gratis | BOOLEAN | - | NOT NULL, DEFAULT false | Se oferece entrega grátis |
| valor_minimo_entrega_gratis | DOUBLE PRECISION | - | NULL | Valor mínimo para entrega grátis |
| tipo_entrega | VARCHAR | - | NOT NULL, DEFAULT 'propria' | 'propria' ou 'terceiros' |
| aberto | BOOLEAN | - | NOT NULL, DEFAULT true | Status de abertura |
| horario_abertura | VARCHAR | - | NULL | Horário de abertura (HH:MM) |
| horario_fechamento | VARCHAR | - | NULL | Horário de fechamento (HH:MM) |
| dias_funcionamento | VARCHAR | - | NULL | Dias da semana separados por vírgula |
| raio_entrega | DOUBLE PRECISION | - | NOT NULL, DEFAULT 10 | Raio de entrega em km |
| ceps_atendidos | VARCHAR | - | NULL | CEPs atendidos separados por vírgula |
| ativo | BOOLEAN | - | NOT NULL, DEFAULT true | Se o restaurante está ativo |
| id_endereco | UUID | - | NOT NULL, FK(enderecos.id) | Endereço do restaurante |

**Relacionamentos:**
- Um restaurante tem um endereço (N:1)
- Um restaurante pode ter vários produtos (1:N)
- Um restaurante pode ter vários pedidos (1:N)
- Um restaurante pode ter várias avaliações (1:N)
- Um restaurante pode ter vários cupons (1:N)

---

## 4. Tabela: produtos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do produto |
| name_produto | VARCHAR | - | NOT NULL | Nome do produto |
| preco | DOUBLE PRECISION | - | NOT NULL | Preço do produto |
| imagem | VARCHAR | - | NULL | URL da imagem do produto |
| descricao | VARCHAR | - | NULL | Descrição do produto |
| ingredientes | VARCHAR | - | NULL | Lista de ingredientes |
| alergenicos | VARCHAR | - | NULL | Informações sobre alergênicos |
| tempo_preparo | INTEGER | - | NULL | Tempo de preparo em minutos |
| estoque | INTEGER | - | NULL | Quantidade em estoque (NULL = ilimitado) |
| quantidade_maxima_pedido | INTEGER | - | NULL | Quantidade máxima por pedido |
| disponivel | BOOLEAN | - | NOT NULL, DEFAULT true | Se está disponível |
| horario_inicio | VARCHAR | - | NULL | Horário de início de disponibilidade (HH:MM) |
| horario_fim | VARCHAR | - | NULL | Horário de fim de disponibilidade (HH:MM) |
| permite_personalizacao | BOOLEAN | - | NOT NULL, DEFAULT false | Se permite personalização |
| ativo | BOOLEAN | - | NOT NULL, DEFAULT true | Se o produto está ativo |
| id_restaurante | UUID | - | NOT NULL, FK(restaurantes.id) | Restaurante dono do produto |
| id_categoria | VARCHAR | - | NOT NULL, FK(categorias.id) | Categoria do produto |

**Relacionamentos:**
- Um produto pertence a um restaurante (N:1)
- Um produto pertence a uma categoria (N:1)
- Um produto pode estar em vários itens de pedido (1:N)
- Um produto pode ter várias opções (1:N)

---

## 5. Tabela: categorias

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | VARCHAR | - | PK, NOT NULL | Identificador da categoria (ex: 'LANCHE') |
| name | VARCHAR | - | NOT NULL | Nome da categoria |

**Relacionamentos:**
- Uma categoria pode ter vários produtos (1:N)

---

## 6. Tabela: pedidos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do pedido |
| data_pedido | TIMESTAMP | - | NOT NULL, DEFAULT now() | Data e hora do pedido |
| subtotal | DOUBLE PRECISION | - | NOT NULL | Subtotal dos itens |
| taxa_entrega | DOUBLE PRECISION | - | NOT NULL | Taxa de entrega |
| desconto | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Valor do desconto (cupom) |
| total | DOUBLE PRECISION | - | NOT NULL | Valor total do pedido |
| observacoes | VARCHAR | - | NULL | Observações do cliente |
| status | VARCHAR | - | NOT NULL, DEFAULT 'PENDENTE' | Status do pedido |
| tempo_estimado_preparo | INTEGER | - | NULL | Tempo estimado de preparo (minutos) |
| tempo_estimado_entrega | INTEGER | - | NULL | Tempo estimado de entrega (minutos) |
| tempo_total_estimado | INTEGER | - | NULL | Tempo total estimado (minutos) |
| tipo_entrega | VARCHAR | - | NOT NULL, DEFAULT 'padrao' | 'padrao', 'prioritaria', 'retirada' |
| valor_troco | DOUBLE PRECISION | - | NULL | Valor do troco (pagamento em dinheiro) |
| latitude_entrega | DOUBLE PRECISION | - | NULL | Latitude do endereço de entrega |
| longitude_entrega | DOUBLE PRECISION | - | NULL | Longitude do endereço de entrega |
| data_confirmacao | TIMESTAMP | - | NULL | Data de confirmação pelo restaurante |
| data_preparando | TIMESTAMP | - | NULL | Data de início do preparo |
| data_saiu_entrega | TIMESTAMP | - | NULL | Data de saída para entrega |
| data_em_rota | TIMESTAMP | - | NULL | Data de início da rota |
| data_entregue | TIMESTAMP | - | NULL | Data de entrega |
| data_cancelado | TIMESTAMP | - | NULL | Data de cancelamento |
| motivo_cancelamento | VARCHAR | - | NULL | Motivo do cancelamento |
| id_restaurante | UUID | - | NOT NULL, FK(restaurantes.id) | Restaurante do pedido |
| id_usuario | UUID | - | NOT NULL, FK(usuarios.id) | Cliente que fez o pedido |
| id_endereco | UUID | - | NOT NULL, FK(enderecos.id) | Endereço de entrega |
| id_cupom | UUID | - | NULL, FK(cupons.id) | Cupom aplicado (se houver) |

**Status possíveis:**
- PENDENTE
- CONFIRMADO
- PREPARANDO
- AGUARDANDO_ENTREGADOR
- EM_ROTA
- ENTREGUE
- CANCELADO
- TENTATIVA_FALHOU

**Relacionamentos:**
- Um pedido pertence a um restaurante (N:1)
- Um pedido pertence a um usuário (N:1)
- Um pedido tem um endereço de entrega (N:1)
- Um pedido pode ter um cupom (N:1)
- Um pedido pode ter vários itens (1:N)
- Um pedido tem um pagamento (1:1)
- Um pedido pode ter uma avaliação (1:1)
- Um pedido tem histórico de status (1:N)

---

## 7. Tabela: itens_pedido

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do item |
| quantidade | INTEGER | - | NOT NULL | Quantidade do produto |
| preco_unitario | DOUBLE PRECISION | - | NOT NULL | Preço unitário no momento do pedido |
| subtotal | DOUBLE PRECISION | - | NOT NULL | Subtotal do item (quantidade × preço) |
| observacoes | VARCHAR | - | NULL | Observações específicas do item |
| personalizacoes | TEXT | - | NULL | JSON com personalizações |
| id_pedido | UUID | - | NOT NULL, FK(pedidos.id) | Pedido ao qual pertence |
| id_produto | UUID | - | NOT NULL, FK(produtos.id) | Produto do item |

**Relacionamentos:**
- Um item pertence a um pedido (N:1)
- Um item referencia um produto (N:1)

---

## 8. Tabela: opcoes_produto

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único da opção |
| nome | VARCHAR | - | NOT NULL | Nome da opção |
| tipo | VARCHAR | - | NOT NULL | Tipo: 'adicional', 'tamanho', 'remocao' |
| preco | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Preço adicional (se houver) |
| obrigatorio | BOOLEAN | - | NOT NULL, DEFAULT false | Se a opção é obrigatória |
| id_produto | UUID | - | NOT NULL, FK(produtos.id) | Produto ao qual pertence |

**Relacionamentos:**
- Uma opção pertence a um produto (N:1)

---

## 9. Tabela: cupons

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do cupom |
| codigo | VARCHAR | - | NOT NULL, UNIQUE | Código do cupom |
| descricao | VARCHAR | - | NULL | Descrição do cupom |
| tipo_desconto | VARCHAR | - | NOT NULL | 'percentual' ou 'valor_fixo' |
| valor_desconto | DOUBLE PRECISION | - | NOT NULL | Valor do desconto |
| valor_minimo_pedido | DOUBLE PRECISION | - | NULL | Valor mínimo do pedido |
| data_inicio | TIMESTAMP | - | NOT NULL | Data de início da validade |
| data_fim | TIMESTAMP | - | NOT NULL | Data de fim da validade |
| uso_maximo | INTEGER | - | NULL | Uso máximo (NULL = ilimitado) |
| uso_atual | INTEGER | - | NOT NULL, DEFAULT 0 | Quantidade de usos atuais |
| ativo | BOOLEAN | - | NOT NULL, DEFAULT true | Se o cupom está ativo |
| exclusivo_restaurante | BOOLEAN | - | NOT NULL, DEFAULT false | Se é exclusivo de um restaurante |
| id_restaurante | UUID | - | NULL, FK(restaurantes.id) | Restaurante exclusivo (se houver) |

**Relacionamentos:**
- Um cupom pode ser exclusivo de um restaurante (N:1)
- Um cupom pode ser usado em vários pedidos (1:N)
- Um cupom pode ser usado por vários usuários (N:M via uso_cupons)

---

## 10. Tabela: uso_cupons

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único |
| data_uso | TIMESTAMP | - | NOT NULL, DEFAULT now() | Data de uso do cupom |
| id_usuario | UUID | - | NOT NULL, FK(usuarios.id) | Usuário que usou |
| id_cupom | UUID | - | NOT NULL, FK(cupons.id) | Cupom usado |

**Restrições:**
- UNIQUE(id_usuario, id_cupom) - Um usuário só pode usar um cupom uma vez

**Relacionamentos:**
- Um registro relaciona um usuário a um cupom (N:M)

---

## 11. Tabela: pagamentos

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único do pagamento |
| forma_pagamento | VARCHAR | - | NOT NULL | 'credito', 'debito', 'pix', 'dinheiro', 'carteira' |
| numero_cartao | VARCHAR | - | NULL | Número do cartão (se aplicável) |
| nome_titular | VARCHAR | - | NULL | Nome do titular (se aplicável) |
| validade_cartao | VARCHAR | - | NULL | Validade do cartão (se aplicável) |
| cvv | VARCHAR | - | NULL | CVV do cartão (se aplicável) |
| qr_code_pix | TEXT | - | NULL | QR Code do PIX |
| pix_expira_em | TIMESTAMP | - | NULL | Data de expiração do PIX |
| valor | DOUBLE PRECISION | - | NOT NULL | Valor do pagamento |
| status | VARCHAR | - | NOT NULL, DEFAULT 'PENDENTE' | Status do pagamento |
| data_aprovacao | TIMESTAMP | - | NULL | Data de aprovação |
| saldo_carteira_usado | DOUBLE PRECISION | - | NOT NULL, DEFAULT 0 | Saldo usado da carteira |
| id_usuario | UUID | - | NOT NULL, FK(usuarios.id) | Usuário que pagou |
| id_pedido | UUID | - | NOT NULL, FK(pedidos.id), UNIQUE | Pedido pago |

**Status possíveis:**
- PENDENTE
- APROVADO
- RECUSADO
- EXPIRADO

**Relacionamentos:**
- Um pagamento pertence a um usuário (N:1)
- Um pagamento pertence a um pedido (1:1)

---

## 12. Tabela: avaliacoes

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único da avaliação |
| nota | INTEGER | - | NOT NULL | Nota de 1 a 5 |
| comentario | VARCHAR | - | NULL | Comentário do cliente |
| denuncia | VARCHAR | - | NULL | Motivo da denúncia (se houver) |
| data_avaliacao | TIMESTAMP | - | NOT NULL, DEFAULT now() | Data da avaliação |
| id_restaurante | UUID | - | NOT NULL, FK(restaurantes.id) | Restaurante avaliado |
| id_pedido | UUID | - | NOT NULL, FK(pedidos.id), UNIQUE | Pedido avaliado |

**Relacionamentos:**
- Uma avaliação pertence a um restaurante (N:1)
- Uma avaliação pertence a um pedido (1:1)

---

## 13. Tabela: historico_status

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único |
| status_anterior | VARCHAR | - | NULL | Status anterior |
| status_novo | VARCHAR | - | NOT NULL | Novo status |
| data_mudanca | TIMESTAMP | - | NOT NULL, DEFAULT now() | Data da mudança |
| observacoes | VARCHAR | - | NULL | Observações sobre a mudança |
| id_pedido | UUID | - | NOT NULL, FK(pedidos.id) | Pedido relacionado |

**Relacionamentos:**
- Um registro pertence a um pedido (N:1)

---

## 14. Tabela: carrinho

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único |
| data_criacao | TIMESTAMP | - | NOT NULL, DEFAULT now() | Data de criação |
| data_expiracao | TIMESTAMP | - | NOT NULL | Data de expiração (30 min) |
| itens | TEXT | - | NOT NULL | JSON com itens do carrinho |
| id_usuario | UUID | - | NOT NULL, FK(usuarios.id) | Usuário dono do carrinho |

**Relacionamentos:**
- Um carrinho pertence a um usuário (N:1)

---

## 15. Tabela: codigos_verificacao

| Campo | Tipo | Tamanho | Restrições | Descrição |
|-------|------|---------|------------|-----------|
| id | UUID | - | PK, NOT NULL, DEFAULT uuid() | Identificador único |
| tipo | VARCHAR | - | NOT NULL | Tipo: 'email', 'sms', 'whatsapp' |
| destino | VARCHAR | - | NOT NULL | Email, telefone ou número WhatsApp |
| codigo_6_digitos | VARCHAR | - | NOT NULL | Código de 6 dígitos |
| usado | BOOLEAN | - | NOT NULL, DEFAULT false | Se o código já foi usado |
| data_criacao | TIMESTAMP | - | NOT NULL, DEFAULT now() | Data de criação |
| data_expiracao | TIMESTAMP | - | NOT NULL | Data de expiração (10 minutos) |
| tentativas | INTEGER | - | NOT NULL, DEFAULT 0 | Número de tentativas |
| max_tentativas | INTEGER | - | NOT NULL, DEFAULT 3 | Máximo de tentativas |

**Índices:**
- INDEX(destino, codigo_6_digitos) - Para busca rápida

**Relacionamentos:**
- Tabela independente (sem FK)

---

## Diagrama de Relacionamentos

```
enderecos (1) ──< (N) usuarios
enderecos (1) ──< (N) restaurantes
enderecos (1) ──< (N) pedidos

usuarios (1) ──< (N) pedidos
usuarios (1) ──< (N) pagamentos
usuarios (1) ──< (N) carrinho
usuarios (N) ──< (M) cupons (via uso_cupons)

restaurantes (1) ──< (N) produtos
restaurantes (1) ──< (N) pedidos
restaurantes (1) ──< (N) avaliacoes
restaurantes (1) ──< (N) cupons

categorias (1) ──< (N) produtos

produtos (1) ──< (N) itens_pedido
produtos (1) ──< (N) opcoes_produto

pedidos (1) ──< (N) itens_pedido
pedidos (1) ──1 (1) pagamentos
pedidos (1) ──1 (1) avaliacoes
pedidos (1) ──< (N) historico_status
pedidos (N) ──1 (1) cupons
```

