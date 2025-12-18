# Índice de Documentação - Pede Aki

Este documento serve como índice para toda a documentação do projeto Pede Aki.

---

## 📚 Documentação Disponível

### 1. Documentação Técnica Completa
**Arquivo**: `DOCUMENTACAO_TECNICA_COMPLETA.md`

**Conteúdo**:
- Visão geral do projeto
- Estrutura completa do projeto
- Todos os endpoints da API organizados por módulo
- Tecnologias e dependências
- Variáveis de ambiente
- Autenticação e segurança
- Como executar o projeto
- Padrões de código
- Logs e debugging
- Guia de deploy

**Quando usar**: Referência técnica completa para desenvolvedores

---

### 2. Funcionalidades e Regras de Negócio
**Arquivo**: `DOCUMENTACAO_FUNCIONALIDADES_E_REGRAS.md`

**Conteúdo**:
- Introdução ao sistema
- Módulo de Autenticação (funcionalidades e regras)
- Módulo de Solicitação de Pedidos:
  - Escolha do Restaurante
  - Acesso ao Cardápio
  - Carrinho de Compras
  - Endereço e Entrega
  - Pagamento
  - Confirmação do Pedido
  - Acompanhamento em Tempo Real
  - Finalização do Pedido
- Tabelas com obrigatoriedade, tamanho, tipo e validação
- Resumo das validações por módulo

**Quando usar**: Entender as regras de negócio e funcionalidades do sistema

---

### 3. Modelo de Dados Físico
**Arquivo**: `MODELO_DADOS_FISICO_COMPLETO.md`

**Conteúdo**:
- Documentação completa de todas as 16 tabelas:
  1. Enderecos
  2. Usuarios
  3. Categorias
  4. Restaurantes
  5. Produtos
  6. Pedidos
  7. ItensPedido
  8. Avaliacoes
  9. Pagamentos
  10. CartoesSalvos
  11. Carrinho
  12. Cupons
  13. UsoCupons
  14. HistoricoStatus
  15. OpcoesProduto
  16. CodigosVerificacao
- Para cada tabela: Campo, Tipo, Tamanho, Restrições e Descrição

**Quando usar**: Consultar estrutura do banco de dados e campos das tabelas

---

### 4. Script SQL Completo
**Arquivo**: `SCRIPT_SQL_COMPLETO.sql`

**Conteúdo**:
- Script SQL para PostgreSQL
- Criação de todas as 16 tabelas
- Chaves primárias e estrangeiras
- Índices para otimização
- Constraints de validação
- Valores padrão
- Extensão uuid-ossp

**Quando usar**: Criar o banco de dados do zero ou aplicar mudanças no schema

---

### 5. Diagrama de Arquitetura
**Arquivo**: `DIAGRAMA_ARQUITETURA_COMPLETO.md` e `DIAGRAMA_MERMAID_CODIGO.md`

**Conteúdo**:
- Código Mermaid completo do diagrama de arquitetura
- Descrição detalhada de todos os componentes
- Versões específicas de todas as tecnologias
- Fluxos de comunicação
- Observações técnicas

**Quando usar**: Entender a arquitetura do sistema e tecnologias utilizadas

---

### 6. Documentação Completa do Projeto
**Arquivo**: `DOCUMENTACAO_COMPLETA_PROJETO.md`

**Conteúdo**:
- Visão geral rápida
- Status de implementação
- Estrutura básica do projeto
- Como usar
- Links para outras documentações

**Quando usar**: Visão geral rápida do projeto e status de implementação

---

## 🗂️ Organização por Tipo de Informação

### Para Desenvolvedores
1. **DOCUMENTACAO_TECNICA_COMPLETA.md** - Referência técnica completa
2. **MODELO_DADOS_FISICO_COMPLETO.md** - Estrutura do banco de dados
3. **SCRIPT_SQL_COMPLETO.sql** - Scripts SQL
4. **DIAGRAMA_ARQUITETURA_COMPLETO.md** - Arquitetura do sistema

### Para Analistas de Negócio
1. **DOCUMENTACAO_FUNCIONALIDADES_E_REGRAS.md** - Regras de negócio e funcionalidades
2. **MODELO_DADOS_FISICO_COMPLETO.md** - Estrutura de dados

### Para Gestores de Projeto
1. **DOCUMENTACAO_COMPLETA_PROJETO.md** - Status e visão geral
2. **DIAGRAMA_ARQUITETURA_COMPLETO.md** - Arquitetura e tecnologias

---

## 🔍 Busca Rápida

### Quero entender...
- **Como funciona o sistema**: `DOCUMENTACAO_FUNCIONALIDADES_E_REGRAS.md`
- **Como executar o projeto**: `DOCUMENTACAO_TECNICA_COMPLETA.md` (Seção 7)
- **Quais são os endpoints**: `DOCUMENTACAO_TECNICA_COMPLETA.md` (Seção 3)
- **Estrutura do banco de dados**: `MODELO_DADOS_FISICO_COMPLETO.md`
- **Criar o banco do zero**: `SCRIPT_SQL_COMPLETO.sql`
- **Arquitetura do sistema**: `DIAGRAMA_ARQUITETURA_COMPLETO.md`
- **Como autenticar**: `DOCUMENTACAO_TECNICA_COMPLETA.md` (Seção 6)
- **Variáveis de ambiente**: `DOCUMENTACAO_TECNICA_COMPLETA.md` (Seção 5)
- **Regras de validação**: `DOCUMENTACAO_FUNCIONALIDADES_E_REGRAS.md`

---

## 📋 Checklist de Documentação

- [x] Documentação técnica completa
- [x] Funcionalidades e regras de negócio
- [x] Modelo de dados físico
- [x] Script SQL completo
- [x] Diagrama de arquitetura
- [x] Lista de endpoints
- [x] Estrutura do projeto
- [x] Guia de instalação e execução
- [x] Variáveis de ambiente
- [x] Autenticação e segurança
- [x] Padrões de código

---

## 🔗 Links Úteis

- **Swagger/API Docs**: http://localhost:3000/api-docs
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001
- **PostgreSQL**: localhost:5432

---

## 📝 Notas

- Todas as documentações estão na pasta `Backend/`
- Os arquivos estão em formato Markdown (.md) para fácil leitura
- O script SQL está pronto para execução no PostgreSQL
- O diagrama Mermaid pode ser visualizado em ferramentas como GitHub, GitLab, ou Mermaid Live Editor

---

**Última atualização**: 2024
