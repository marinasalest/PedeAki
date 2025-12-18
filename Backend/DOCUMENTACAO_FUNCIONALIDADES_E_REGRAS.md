# Pede Aki - Documentação de Funcionalidades e Regras de Negócio

## 1. Introdução

O Pede Aki é um aplicativo de delivery que tem como objetivo entrar para o mercado de serviços de entrega de alimentos fastfood no Brasil, trazendo facilidade e comodidade aos clientes.

---

## 2. Funcionalidades e Regras de Negócio

### 2.1. Módulo de Autenticação

#### 2.1.1. Funcionalidades

- Cadastro de usuários com validação de dados pessoais
- Login com email e senha
- Autenticação via redes sociais (Facebook/Gmail)
- Recuperação de senha
- Validação de CPF único
- Validação de email único
- Criptografia de senhas com bcrypt

#### 2.1.2. Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Nome | Sim | Mínimo: 3 caracteres<br>Máximo: 100 caracteres | String | Deve conter apenas letras e espaços |
| CPF | Sim | 14 caracteres (formato: XXX.XXX.XXX-XX) | String | Deve ser válido e único no sistema |
| Data de Nascimento | Sim | Formato: YYYY-MM-DD | Date | Usuário deve ter pelo menos 18 anos |
| Email | Sim | Máximo: 255 caracteres | String (email) | Deve ser válido e único no sistema |
| Senha | Sim | Mínimo: 6 caracteres | String | Será criptografada com bcrypt |
| Endereço | Sim | UUID | String (UUID) | Endereço deve existir e ser válido |

**Regras Adicionais:**
- Sessão expira após 24 horas de inatividade
- Token JWT válido por 24 horas
- Senha deve ser criptografada antes de armazenar no banco de dados

---

### 2.2. Módulo de Solicitação de Pedidos

#### 2.2.1. Escolha do Restaurante

##### Funcionalidades

- Listagem de restaurantes próximos baseada no endereço do usuário
- Filtro por:
  - Categoria (hambúrguer, almoço, pizza, sushi, etc.)
  - Avaliação mínima
  - Faixa de preço
  - Tempo estimado de entrega
  - Tipo de entrega: própria / terceiros
- Exibição de:
  - Nome, foto, nota do restaurante
  - Taxa de entrega
  - Tempo estimado
  - Indicador "Fechado / Aberto" com horário de funcionamento
  - Selo "Entrega Grátis" quando aplicável

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Distância máxima | Obrigatório | Restaurantes devem estar até no máximo 10 km do endereço do usuário |
| CEP de entrega | Obrigatório | Restaurantes devem entregar no CEP informado |
| Status do restaurante | Obrigatório | Restaurantes devem estar abertos para aparecer na listagem |
| Valor mínimo de pedido | Obrigatório | Restaurante pode definir valor mínimo para concluir compra |
| Tempo estimado | Obrigatório | Calculado considerando tempo de preparo + tempo de entrega |

**Regras Adicionais:**
- Restaurantes podem desabilitar itens sem estoque
- Restaurantes podem aumentar o tempo estimado em horários de pico
- O tempo total considera o tempo de preparo de todos os pedidos mais o tempo de entrega

---

#### 2.2.2. Acesso ao Cardápio

##### Funcionalidades

- Exibição de produtos separados por categorias
- Visualização detalhada do produto:
  - Descrição, ingredientes, alergênicos
  - Foto ampliada
  - Tempo de preparo estimado
- Opções personalizáveis:
  - Adicionais (ex.: bacon, molho especial)
  - Remoção de itens (ex.: tirar cebola)
  - Escolha de tamanhos (ex.: pequeno, médio, grande)
- Produtos podem conter:
  - Estoque limitado
  - Disponibilidade por horário (ex.: almoço disponível 11h–15h)

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Nome do produto | Sim | Mínimo: 3 caracteres<br>Máximo: 100 caracteres | String | Deve estar associado a um restaurante e categoria válidos |
| Preço | Sim | Decimal (2 casas) | Number (Float) | Deve ser maior ou igual a 0 |
| Categoria | Sim | String | String | Deve ser uma categoria válida (LANCHES, PIZZA, SUSHI, etc.) |
| Descrição | Não | Máximo: 500 caracteres | String | Opcional |
| Imagem | Não | String (URL ou nome do arquivo) | String | Opcional |

**Regras de Visibilidade e Disponibilidade:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Restaurante aberto | Obrigatório | Usuário só pode visualizar cardápio de restaurantes abertos |
| Atendimento ao endereço | Obrigatório | Restaurante deve atender ao endereço de entrega do usuário |
| Estoque disponível | Obrigatório | Produtos sem estoque aparecem bloqueados e não podem ser adicionados ao carrinho |
| Horário de funcionamento | Condicional | Itens com horário específico só ficam visíveis/habilitados no período configurado |
| Produto ativo | Obrigatório | Produtos inativos não aparecem no cardápio |
| Associação válida | Obrigatório | Produto deve estar associado a restaurante e categoria válidos |

**Regras de Personalização:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Permissão de personalização | Condicional | Personalização só é permitida se restaurante disponibilizar essa função no produto |
| Preço de adicionais | Obrigatório | Opções adicionais seguem preços definidos pelo restaurante e são obrigatoriamente somadas ao valor do produto |
| Quantidade máxima | Condicional | Quantidade máxima de um item depende do limite estabelecido pelo restaurante |

---

#### 2.2.3. Carrinho de Compras

##### Funcionalidades

- Alterar quantidade
- Remover itens
- Adicionar observações ao pedido (ex.: "bem passado", "sem pimenta")
- Resumo automático:
  - Subtotal
  - Taxa de entrega
  - Descontos e cupons
  - Valor total
- Verificação automática de pedido mínimo por restaurante

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Produto ID | Sim | UUID | String (UUID) | Produto deve existir e estar disponível |
| Quantidade | Sim | Mínimo: 1<br>Máximo: conforme quantidade_maxima_pedido | Integer | Deve respeitar limite do produto |
| Observações | Não | Máximo: 500 caracteres | String | Opcional |
| Personalizações | Condicional | Object | Object | Só permitido se produto permite_personalizacao = true |
| Opções adicionais | Não | Array de UUIDs | Array | Preços são somados ao produto |

**Regras de Validação:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Valor mínimo | Obrigatório | Deve respeitar valor mínimo obrigatório do restaurante para finalizar |
| Estoque disponível | Obrigatório | Produto deve ter estoque suficiente |
| Horário de funcionamento | Condicional | Produto deve estar dentro do horário de disponibilidade |
| Restaurante único | Obrigatório | Não é possível adicionar produtos de restaurantes diferentes no mesmo carrinho |
| Expiração | Obrigatório | Itens adicionados expiram após 30 minutos se não houver finalização |

**Regras de Cupom de Desconto:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Uso único | Obrigatório | Cupom só pode ser usado uma vez por usuário |
| Restaurante específico | Condicional | Cupom pode ser exclusivo para determinados restaurantes |
| Validade | Obrigatório | Cupom deve estar válido e não expirado |

---

#### 2.2.4. Endereço e Entrega

##### Funcionalidades

- Escolha entre:
  - Endereço cadastrado
  - Adicionar novo endereço
- Definir modalidade:
  - Entrega padrão
  - Entrega prioritária (se disponível)
  - Retirada no local
- Cálculo automático do tempo estimado baseado em:
  - Distância
  - Fila de pedidos do restaurante
  - Disponibilidade de entregadores

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Rua | Sim | Mínimo: 3 caracteres<br>Máximo: 200 caracteres | String | Nome da rua ou logradouro |
| Número | Sim | Máximo: 20 caracteres | String | Número do endereço |
| Complemento | Não | Máximo: 100 caracteres | String | Opcional |
| Bairro | Sim | Mínimo: 2 caracteres<br>Máximo: 100 caracteres | String | Nome do bairro |
| Cidade | Sim | Mínimo: 2 caracteres<br>Máximo: 100 caracteres | String | Nome da cidade |
| Estado | Sim | Mínimo: 2 caracteres<br>Máximo: 50 caracteres | String | Nome completo ou sigla do estado |
| CEP | Sim | 8 dígitos (sem hífen) | String | Formato: 01310100 |

**Regras de Entrega:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Tentativa de entrega falhou | Automático | Sistema cria status "Tentativa de entrega falhou" se entregador não conseguir realizar entrega |
| Confirmação de entrega | Obrigatório | Pedido é considerado entregue quando entregador confirma e sistema registra geolocalização final |
| Alteração de endereço | Condicional | Usuário pode alterar endereço somente enquanto pedido está pendente |

---

#### 2.2.5. Pagamento

##### Funcionalidades

- Métodos disponíveis:
  - Cartão de crédito/débito
  - Pix
  - Dinheiro
  - Carteira digital do app
- Funcionalidades específicas:
  - Salvar cartão
  - Dividir valor entre saldo da carteira e outro método
  - Geração automática do QR Code Pix
- Validações:
  - Não permitir finalizar sem um método válido
  - Para dinheiro, permite informar o troco necessário

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Forma de pagamento | Sim | Enum | String | Valores: credito, debito, dinheiro, pix, carteira |
| Cartão (se crédito/débito) | Condicional | UUID | String (UUID) | Obrigatório se formaPagamento = "credito" ou "debito" |
| Valor do troco (se dinheiro) | Condicional | Decimal (2 casas) | Number (Float) | Obrigatório se formaPagamento = "dinheiro" |
| Código do cupom | Não | Máximo: 50 caracteres | String | Opcional, deve estar válido |

**Regras de Processamento:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Aprovação financeira | Obrigatório | Pedido só é enviado ao restaurante após aprovação financeira |
| Expiração do Pix | Obrigatório | Pagamento com Pix tem tempo de expiração (ex.: 10 minutos) |
| Falha no pagamento | Automático | Se pagamento falhar, pedido é automaticamente cancelado |
| Cartão padrão | Automático | Se formaPagamento = "credito", busca automaticamente cartão padrão cadastrado |

---

#### 2.2.6. Confirmação do Pedido

##### Funcionalidades

- Resumo final antes de enviar:
  - Itens + quantidades
  - Restaurante
  - Endereço
  - Pagamento
  - Horário estimado
- Criar pedido com status inicial CONFIRMADO (pedido feito)
- Envio automático da notificação:
  - "Seu pedido foi recebido pelo restaurante!"

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Status inicial | Automático | Enum | String | Valor: "CONFIRMADO" |
| Data de confirmação | Automático | DateTime | Date | Gerado automaticamente ao criar pedido |
| Itens do pedido | Obrigatório | Array | Array | Deve conter pelo menos um item do carrinho |
| Endereço de entrega | Obrigatório | UUID | String (UUID) | Endereço deve existir |
| Forma de pagamento | Obrigatório | Enum | String | Deve ser válida |

**Regras de Processamento:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Atribuição de entregador | Condicional | Entregador só é atribuído após restaurante mudar status para "PREPARANDO" |
| Alteração de endereço | Condicional | Usuário pode alterar endereço somente enquanto pedido está pendente |
| Cancelamento pelo usuário | Condicional | Cancelar pedido apenas em: Pendente ou Confirmado (se restaurante permitir) |
| Recusa pelo restaurante | Condicional | Restaurante pode recusar pedido quando: fora do horário, itens sem estoque, endereço inseguro |

---

#### 2.2.7. Acompanhamento em Tempo Real

##### Funcionalidades

- Linha do tempo com estados do pedido:
  - Pendente → Confirmado → Preparando → Aguardando Entregador → Em Rota → Entregue
- Informações em tempo real:
  - Atribuição do entregador
  - Localização do entregador no mapa
  - Previsão atualizada de chegada
  - Notificações push a cada mudança de status

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Status | Obrigatoriedade | Sequência | Validação |
|--------|-----------------|-----------|-----------|
| PENDENTE | Inicial | 1º | Status inicial do pedido |
| CONFIRMADO | Obrigatório | 2º | Após criação do pedido |
| PREPARANDO | Obrigatório | 3º | Restaurante inicia preparo |
| AGUARDANDO_ENTREGADOR | Obrigatório | 4º | Antes de atribuir entregador |
| EM_ROTA | Obrigatório | 5º | Entregador retirou pedido |
| ENTREGUE | Obrigatório | 6º | Entregador confirmou entrega |
| CANCELADO | Condicional | Qualquer | Pode ocorrer em qualquer momento antes de ENTREGUE |
| TENTATIVA_FALHOU | Condicional | Após EM_ROTA | Se entrega falhar |
| RECUSADO | Condicional | Antes de PREPARANDO | Restaurante recusa pedido |

**Regras de Atualização:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Atualizações em tempo real | Condicional | Usuário só recebe atualizações após pedido ser Confirmado pelo restaurante |
| Status Aguardando Entregador | Obrigatório | É obrigatório antes de definir entregador responsável |
| Início de Em Rota | Obrigatório | Entregador só pode iniciar status "Em Rota" após retirar pedido no restaurante |
| Visualização durante Em Rota | Obrigatório | Usuário deve visualizar: localização aproximada do entregador, tempo estimado atualizado, dados básicos do entregador |
| Notificações push | Obrigatório | Mudanças de status devem gerar notificações push para o usuário |
| Falha na entrega | Condicional | Sistema deve registrar status "Tentativa de entrega falhou" antes de nova tentativa ou cancelamento |
| Confirmação de entrega | Obrigatório | Pedido só pode ser marcado como "Entregue" após confirmação do entregador via app |

**Atualização Automática de Timestamps:**

| Status | Timestamp Atualizado | Descrição |
|--------|---------------------|-----------|
| CANCELADO | data_cancelamento | Atualizado automaticamente ao cancelar |
| PREPARANDO | data_preparacao | Atualizado automaticamente ao iniciar preparo |
| EM_ROTA | data_saiu_entrega | Atualizado automaticamente quando entregador inicia rota |
| ENTREGUE | data_entrega | Atualizado automaticamente quando entregador confirma entrega |

---

#### 2.2.8. Finalização do Pedido

##### Funcionalidades

- Após Entregue:
  - Solicitação obrigatória de avaliação (nota + comentário)
  - Opção de denunciar problemas (pedido errado, atraso, falta de item)
  - Opção "Pedir de novo" para repetir facilmente

##### Regras de Negócio

**Obrigatoriedade, Tamanho, Tipo e Validação:**

| Campo | Obrigatório | Tamanho | Tipo | Regra de Validação |
|-------|-------------|---------|------|-------------------|
| Avaliação (nota) | Sim | Integer (1 a 5) | Integer | Deve estar entre 1 e 5 |
| Comentário | Condicional | Máximo: 500 caracteres | String | Opcional, mas recomendado |
| Denúncia | Condicional | Máximo: 1000 caracteres | String | Só pode ser aberta após finalização |

**Regras de Processamento:**

| Regra | Obrigatoriedade | Validação |
|-------|-----------------|-----------|
| Solicitação de avaliação | Obrigatório | Após status "Entregue", sistema deve obrigatoriamente solicitar avaliação do usuário |
| Avaliação única | Obrigatório | Usuário só pode avaliar o restaurante uma vez por pedido |
| Abertura de denúncia | Condicional | Denúncias de problemas só podem ser abertas após finalização do pedido |
| Exibição de dados | Obrigatório | Pedido finalizado deve exibir: itens comprados, totais pagos, forma de pagamento, horário da entrega |
| Acesso ao histórico | Sempre disponível | Pedidos finalizados podem ser acessados a qualquer momento no histórico do usuário |
| Auditoria | Obrigatório | Produtos ou descontos usados no pedido finalizado devem ficar gravados para fins de auditoria e não podem ser alterados após conclusão |
| Pedir novamente | Funcional | Botão "Pedir novamente" deve repetir automaticamente os itens, porém respeitando disponibilidade atual de estoque e preço atualizado |
| Cancelamento após entrega | Proibido | Cancelamentos não são permitidos após pedido estar marcado como "Entregue" |

---

## 3. Resumo das Validações por Módulo

### 3.1. Autenticação

- **CPF**: Formato XXX.XXX.XXX-XX, válido e único
- **Email**: Formato válido, único no sistema, máximo 255 caracteres
- **Senha**: Mínimo 6 caracteres, criptografada com bcrypt
- **Idade**: Mínimo 18 anos
- **Endereço**: Obrigatório para cadastro
- **Sessão**: Expira após 24 horas

### 3.2. Restaurantes

- **Distância**: Máximo 10 km do endereço do usuário
- **CEP**: Deve atender ao CEP informado
- **Status**: Deve estar aberto para aparecer na listagem
- **Valor mínimo**: Pode ser definido pelo restaurante

### 3.3. Produtos

- **Nome**: Obrigatório, 3-100 caracteres
- **Preço**: Obrigatório, >= 0
- **Categoria**: Obrigatória, deve ser válida
- **Estoque**: Produtos sem estoque aparecem bloqueados
- **Horário**: Respeitar horário de funcionamento se configurado
- **Ativo**: Produtos inativos não aparecem no cardápio

### 3.4. Carrinho

- **Valor mínimo**: Deve respeitar valor mínimo do restaurante
- **Estoque**: Validar estoque disponível
- **Quantidade**: Respeitar quantidade máxima do produto
- **Restaurante único**: Não permitir produtos de restaurantes diferentes
- **Expiração**: Itens expiram após 30 minutos

### 3.5. Pedidos

- **Status**: Sequência obrigatória respeitada
- **Cancelamento**: Apenas em PENDENTE ou CONFIRMADO
- **Alteração de endereço**: Apenas em PENDENTE
- **Avaliação**: Obrigatória após ENTREGUE
- **Denúncia**: Apenas após finalização

---

## 4. Conclusão

Esta documentação apresenta todas as funcionalidades e regras de negócio do sistema Pede Aki, incluindo obrigatoriedades, tamanhos, tipos e validações de cada campo e processo. As regras garantem a integridade dos dados, a segurança das transações e a melhor experiência do usuário.
