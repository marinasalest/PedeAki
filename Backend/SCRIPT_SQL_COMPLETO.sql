-- =====================================================
-- Script SQL Completo - Pede Aki
-- PostgreSQL Database Schema
-- =====================================================

-- Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 4.1. Tabela: Enderecos
-- =====================================================
CREATE TABLE IF NOT EXISTS "enderecos" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "rua" VARCHAR(200) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "latitude" FLOAT,
    "longitude" FLOAT
);

-- =====================================================
-- 4.2. Tabela: Usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS "usuarios" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "cpf" VARCHAR(14) UNIQUE,
    "data_nascimento" DATE,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255),
    "facebook_id" VARCHAR(255) UNIQUE,
    "google_id" VARCHAR(255) UNIQUE,
    "provider" VARCHAR(50),
    "id_endereco" UUID,
    "saldo_carteira" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    CONSTRAINT "fk_usuarios_endereco" 
        FOREIGN KEY ("id_endereco") 
        REFERENCES "enderecos"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- Índices para Usuarios
CREATE INDEX IF NOT EXISTS "idx_usuarios_email" ON "usuarios"("email");
CREATE INDEX IF NOT EXISTS "idx_usuarios_cpf" ON "usuarios"("cpf");
CREATE INDEX IF NOT EXISTS "idx_usuarios_id_endereco" ON "usuarios"("id_endereco");

-- =====================================================
-- 4.3. Tabela: Categorias
-- =====================================================
CREATE TABLE IF NOT EXISTS "categorias" (
    "id" VARCHAR(50) PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);

-- =====================================================
-- 4.4. Tabela: Restaurantes
-- =====================================================
CREATE TABLE IF NOT EXISTS "restaurantes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "cnpj" VARCHAR(18) UNIQUE NOT NULL,
    "nome_fantasia" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "avaliacao" DECIMAL(3, 2) NOT NULL DEFAULT 0.0,
    "foto" VARCHAR(255),
    "taxa_entrega" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "tempo_medio_preparo" INTEGER NOT NULL DEFAULT 30,
    "tempo_medio_entrega" INTEGER NOT NULL DEFAULT 30,
    "valor_minimo_pedido" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "entrega_gratis" BOOLEAN NOT NULL DEFAULT FALSE,
    "valor_minimo_entrega_gratis" DECIMAL(10, 2),
    "tipo_entrega" VARCHAR(50) NOT NULL DEFAULT 'propria',
    "aberto" BOOLEAN NOT NULL DEFAULT TRUE,
    "horario_abertura" VARCHAR(5),
    "horario_fechamento" VARCHAR(5),
    "dias_funcionamento" VARCHAR(100),
    "raio_entrega" DECIMAL(10, 2) NOT NULL DEFAULT 10,
    "ceps_atendidos" VARCHAR(500),
    "ativo" BOOLEAN NOT NULL DEFAULT TRUE,
    "id_endereco" UUID NOT NULL,
    "id_categoria" VARCHAR(50) NOT NULL,
    
    CONSTRAINT "fk_restaurantes_endereco" 
        FOREIGN KEY ("id_endereco") 
        REFERENCES "enderecos"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_restaurantes_categoria" 
        FOREIGN KEY ("id_categoria") 
        REFERENCES "categorias"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Índices para Restaurantes
CREATE INDEX IF NOT EXISTS "idx_restaurantes_email" ON "restaurantes"("email");
CREATE INDEX IF NOT EXISTS "idx_restaurantes_cnpj" ON "restaurantes"("cnpj");
CREATE INDEX IF NOT EXISTS "idx_restaurantes_id_endereco" ON "restaurantes"("id_endereco");
CREATE INDEX IF NOT EXISTS "idx_restaurantes_id_categoria" ON "restaurantes"("id_categoria");
CREATE INDEX IF NOT EXISTS "idx_restaurantes_aberto" ON "restaurantes"("aberto");

-- =====================================================
-- 4.5. Tabela: Produtos
-- =====================================================
CREATE TABLE IF NOT EXISTS "produtos" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name_produto" VARCHAR(100) NOT NULL,
    "preco" DECIMAL(10, 2) NOT NULL,
    "imagem" VARCHAR(255),
    "descricao" VARCHAR(500),
    "ingredientes" VARCHAR(500),
    "alergenicos" VARCHAR(200),
    "tempo_preparo" INTEGER,
    "estoque" INTEGER,
    "quantidade_maxima_pedido" INTEGER,
    "disponivel" BOOLEAN NOT NULL DEFAULT TRUE,
    "horario_inicio" VARCHAR(5),
    "horario_fim" VARCHAR(5),
    "permite_personalizacao" BOOLEAN NOT NULL DEFAULT FALSE,
    "ativo" BOOLEAN NOT NULL DEFAULT TRUE,
    "id_restaurante" UUID NOT NULL,
    "id_categoria" VARCHAR(50) NOT NULL,
    
    CONSTRAINT "fk_produtos_restaurante" 
        FOREIGN KEY ("id_restaurante") 
        REFERENCES "restaurantes"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_produtos_categoria" 
        FOREIGN KEY ("id_categoria") 
        REFERENCES "categorias"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Índices para Produtos
CREATE INDEX IF NOT EXISTS "idx_produtos_id_restaurante" ON "produtos"("id_restaurante");
CREATE INDEX IF NOT EXISTS "idx_produtos_id_categoria" ON "produtos"("id_categoria");
CREATE INDEX IF NOT EXISTS "idx_produtos_disponivel" ON "produtos"("disponivel");
CREATE INDEX IF NOT EXISTS "idx_produtos_ativo" ON "produtos"("ativo");

-- =====================================================
-- 4.6. Tabela: Pedidos
-- =====================================================
CREATE TABLE IF NOT EXISTS "pedidos" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "data_pedido" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10, 2) NOT NULL,
    "taxa_entrega" DECIMAL(10, 2) NOT NULL,
    "desconto" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10, 2) NOT NULL,
    "observacoes" VARCHAR(500),
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    "tempo_estimado_preparo" INTEGER,
    "tempo_estimado_entrega" INTEGER,
    "tempo_total_estimado" INTEGER,
    "tipo_entrega" VARCHAR(50) NOT NULL DEFAULT 'padrao',
    "valor_troco" DECIMAL(10, 2),
    "latitude_entrega" FLOAT,
    "longitude_entrega" FLOAT,
    "data_confirmacao" TIMESTAMP,
    "data_preparando" TIMESTAMP,
    "data_saiu_entrega" TIMESTAMP,
    "data_em_rota" TIMESTAMP,
    "data_entregue" TIMESTAMP,
    "data_cancelado" TIMESTAMP,
    "motivo_cancelamento" VARCHAR(500),
    "id_restaurante" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_endereco" UUID NOT NULL,
    "id_cupom" UUID,
    
    CONSTRAINT "fk_pedidos_restaurante" 
        FOREIGN KEY ("id_restaurante") 
        REFERENCES "restaurantes"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_pedidos_usuario" 
        FOREIGN KEY ("id_usuario") 
        REFERENCES "usuarios"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_pedidos_endereco" 
        FOREIGN KEY ("id_endereco") 
        REFERENCES "enderecos"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Índices para Pedidos
CREATE INDEX IF NOT EXISTS "idx_pedidos_id_restaurante" ON "pedidos"("id_restaurante");
CREATE INDEX IF NOT EXISTS "idx_pedidos_id_usuario" ON "pedidos"("id_usuario");
CREATE INDEX IF NOT EXISTS "idx_pedidos_id_endereco" ON "pedidos"("id_endereco");
CREATE INDEX IF NOT EXISTS "idx_pedidos_status" ON "pedidos"("status");
CREATE INDEX IF NOT EXISTS "idx_pedidos_data_pedido" ON "pedidos"("data_pedido");

-- =====================================================
-- 4.7. Tabela: ItensPedido
-- =====================================================
CREATE TABLE IF NOT EXISTS "itens_pedido" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10, 2) NOT NULL,
    "subtotal" DECIMAL(10, 2) NOT NULL,
    "observacoes" VARCHAR(500),
    "personalizacoes" VARCHAR(1000),
    "id_pedido" UUID NOT NULL,
    "id_produto" UUID NOT NULL,
    
    CONSTRAINT "fk_itens_pedido_pedido" 
        FOREIGN KEY ("id_pedido") 
        REFERENCES "pedidos"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_itens_pedido_produto" 
        FOREIGN KEY ("id_produto") 
        REFERENCES "produtos"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "chk_quantidade_positiva" 
        CHECK ("quantidade" > 0),
    
    CONSTRAINT "chk_preco_unitario_positivo" 
        CHECK ("preco_unitario" >= 0),
    
    CONSTRAINT "chk_subtotal_positivo" 
        CHECK ("subtotal" >= 0)
);

-- Índices para ItensPedido
CREATE INDEX IF NOT EXISTS "idx_itens_pedido_id_pedido" ON "itens_pedido"("id_pedido");
CREATE INDEX IF NOT EXISTS "idx_itens_pedido_id_produto" ON "itens_pedido"("id_produto");

-- =====================================================
-- 4.8. Tabela: Avaliacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS "avaliacoes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nota" INTEGER NOT NULL,
    "comentario" VARCHAR(1000),
    "denuncia" VARCHAR(1000),
    "data_avaliacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_restaurante" UUID NOT NULL,
    "id_pedido" UUID UNIQUE NOT NULL,
    
    CONSTRAINT "fk_avaliacoes_restaurante" 
        FOREIGN KEY ("id_restaurante") 
        REFERENCES "restaurantes"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_avaliacoes_pedido" 
        FOREIGN KEY ("id_pedido") 
        REFERENCES "pedidos"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT "chk_nota_valida" 
        CHECK ("nota" >= 1 AND "nota" <= 5)
);

-- Índices para Avaliacoes
CREATE INDEX IF NOT EXISTS "idx_avaliacoes_id_restaurante" ON "avaliacoes"("id_restaurante");
CREATE INDEX IF NOT EXISTS "idx_avaliacoes_id_pedido" ON "avaliacoes"("id_pedido");
CREATE INDEX IF NOT EXISTS "idx_avaliacoes_nota" ON "avaliacoes"("nota");

-- =====================================================
-- 4.9. Tabela: Pagamentos
-- =====================================================
CREATE TABLE IF NOT EXISTS "pagamentos" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "forma_pagamento" VARCHAR(50) NOT NULL,
    "numero_cartao" VARCHAR(4),
    "nome_titular" VARCHAR(100),
    "validade_cartao" VARCHAR(7),
    "cvv" VARCHAR(3),
    "qr_code_pix" VARCHAR(500),
    "pix_expira_em" TIMESTAMP,
    "valor" DECIMAL(10, 2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    "data_aprovacao" TIMESTAMP,
    "saldo_carteira_usado" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "id_usuario" UUID NOT NULL,
    "id_pedido" UUID UNIQUE NOT NULL,
    
    CONSTRAINT "fk_pagamentos_usuario" 
        FOREIGN KEY ("id_usuario") 
        REFERENCES "usuarios"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_pagamentos_pedido" 
        FOREIGN KEY ("id_pedido") 
        REFERENCES "pedidos"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT "chk_valor_positivo" 
        CHECK ("valor" >= 0),
    
    CONSTRAINT "chk_saldo_carteira_positivo" 
        CHECK ("saldo_carteira_usado" >= 0)
);

-- Índices para Pagamentos
CREATE INDEX IF NOT EXISTS "idx_pagamentos_id_usuario" ON "pagamentos"("id_usuario");
CREATE INDEX IF NOT EXISTS "idx_pagamentos_id_pedido" ON "pagamentos"("id_pedido");
CREATE INDEX IF NOT EXISTS "idx_pagamentos_status" ON "pagamentos"("status");
CREATE INDEX IF NOT EXISTS "idx_pagamentos_forma_pagamento" ON "pagamentos"("forma_pagamento");

-- =====================================================
-- 4.10. Tabela: CartoesSalvos
-- =====================================================
CREATE TABLE IF NOT EXISTS "cartoes_salvos" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "numero_cartao" VARCHAR(4) NOT NULL,
    "nome_titular" VARCHAR(100) NOT NULL,
    "validade_cartao" VARCHAR(7) NOT NULL,
    "bandeira" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "padrao" BOOLEAN NOT NULL DEFAULT FALSE,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" UUID NOT NULL,
    
    CONSTRAINT "fk_cartoes_salvos_usuario" 
        FOREIGN KEY ("id_usuario") 
        REFERENCES "usuarios"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Índices para CartoesSalvos
CREATE INDEX IF NOT EXISTS "idx_cartoes_salvos_id_usuario" ON "cartoes_salvos"("id_usuario");
CREATE INDEX IF NOT EXISTS "idx_cartoes_salvos_padrao" ON "cartoes_salvos"("id_usuario", "padrao") WHERE "padrao" = TRUE;

-- =====================================================
-- 4.11. Tabela: Carrinho
-- =====================================================
CREATE TABLE IF NOT EXISTS "carrinho" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP NOT NULL,
    "itens" TEXT NOT NULL,
    "id_usuario" UUID NOT NULL,
    
    CONSTRAINT "fk_carrinho_usuario" 
        FOREIGN KEY ("id_usuario") 
        REFERENCES "usuarios"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Índices para Carrinho
CREATE INDEX IF NOT EXISTS "idx_carrinho_id_usuario" ON "carrinho"("id_usuario");
CREATE INDEX IF NOT EXISTS "idx_carrinho_data_expiracao" ON "carrinho"("data_expiracao");

-- =====================================================
-- 4.12. Tabela: Cupons
-- =====================================================
CREATE TABLE IF NOT EXISTS "cupons" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(50) UNIQUE NOT NULL,
    "descricao" VARCHAR(500),
    "tipo_desconto" VARCHAR(50) NOT NULL,
    "valor_desconto" DECIMAL(10, 2) NOT NULL,
    "valor_minimo_pedido" DECIMAL(10, 2),
    "data_inicio" TIMESTAMP NOT NULL,
    "data_fim" TIMESTAMP NOT NULL,
    "uso_maximo" INTEGER,
    "uso_atual" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT TRUE,
    "exclusivo_restaurante" BOOLEAN NOT NULL DEFAULT FALSE,
    "id_restaurante" UUID,
    
    CONSTRAINT "fk_cupons_restaurante" 
        FOREIGN KEY ("id_restaurante") 
        REFERENCES "restaurantes"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    CONSTRAINT "chk_valor_desconto_positivo" 
        CHECK ("valor_desconto" >= 0),
    
    CONSTRAINT "chk_uso_atual_positivo" 
        CHECK ("uso_atual" >= 0),
    
    CONSTRAINT "chk_data_fim_maior_inicio" 
        CHECK ("data_fim" > "data_inicio")
);

-- Índices para Cupons
CREATE INDEX IF NOT EXISTS "idx_cupons_codigo" ON "cupons"("codigo");
CREATE INDEX IF NOT EXISTS "idx_cupons_id_restaurante" ON "cupons"("id_restaurante");
CREATE INDEX IF NOT EXISTS "idx_cupons_ativo" ON "cupons"("ativo");

-- Adicionar FK de cupons em pedidos (se ainda não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_pedidos_cupom'
    ) THEN
        ALTER TABLE "pedidos" 
        ADD CONSTRAINT "fk_pedidos_cupom" 
        FOREIGN KEY ("id_cupom") 
        REFERENCES "cupons"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- =====================================================
-- 4.13. Tabela: UsoCupons
-- =====================================================
CREATE TABLE IF NOT EXISTS "uso_cupons" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "data_uso" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" UUID NOT NULL,
    "id_cupom" UUID NOT NULL,
    
    CONSTRAINT "fk_uso_cupons_usuario" 
        FOREIGN KEY ("id_usuario") 
        REFERENCES "usuarios"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT "fk_uso_cupons_cupom" 
        FOREIGN KEY ("id_cupom") 
        REFERENCES "cupons"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT "uk_uso_cupons_usuario_cupom" 
        UNIQUE ("id_usuario", "id_cupom")
);

-- Índices para UsoCupons
CREATE INDEX IF NOT EXISTS "idx_uso_cupons_id_usuario" ON "uso_cupons"("id_usuario");
CREATE INDEX IF NOT EXISTS "idx_uso_cupons_id_cupom" ON "uso_cupons"("id_cupom");

-- =====================================================
-- 4.14. Tabela: HistoricoStatus
-- =====================================================
CREATE TABLE IF NOT EXISTS "historico_status" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "status_anterior" VARCHAR(50),
    "status_novo" VARCHAR(50) NOT NULL,
    "data_mudanca" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" VARCHAR(500),
    "id_pedido" UUID NOT NULL,
    
    CONSTRAINT "fk_historico_status_pedido" 
        FOREIGN KEY ("id_pedido") 
        REFERENCES "pedidos"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Índices para HistoricoStatus
CREATE INDEX IF NOT EXISTS "idx_historico_status_id_pedido" ON "historico_status"("id_pedido");
CREATE INDEX IF NOT EXISTS "idx_historico_status_data_mudanca" ON "historico_status"("data_mudanca");

-- =====================================================
-- 4.15. Tabela: OpcoesProduto
-- =====================================================
CREATE TABLE IF NOT EXISTS "opcoes_produto" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nome" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "preco" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT FALSE,
    "id_produto" UUID NOT NULL,
    
    CONSTRAINT "fk_opcoes_produto_produto" 
        FOREIGN KEY ("id_produto") 
        REFERENCES "produtos"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT "chk_preco_opcao_positivo" 
        CHECK ("preco" >= 0)
);

-- Índices para OpcoesProduto
CREATE INDEX IF NOT EXISTS "idx_opcoes_produto_id_produto" ON "opcoes_produto"("id_produto");

-- =====================================================
-- 4.16. Tabela: CodigosVerificacao
-- =====================================================
CREATE TABLE IF NOT EXISTS "codigos_verificacao" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tipo" VARCHAR(50) NOT NULL,
    "destino" VARCHAR(255) NOT NULL,
    "codigo_6_digitos" VARCHAR(6) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT FALSE,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP NOT NULL,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "max_tentativas" INTEGER NOT NULL DEFAULT 3,
    
    CONSTRAINT "chk_tentativas_positivas" 
        CHECK ("tentativas" >= 0),
    
    CONSTRAINT "chk_max_tentativas_positivas" 
        CHECK ("max_tentativas" > 0)
);

-- Índices para CodigosVerificacao
CREATE INDEX IF NOT EXISTS "idx_codigos_verificacao_destino_codigo" 
    ON "codigos_verificacao"("destino", "codigo_6_digitos");
CREATE INDEX IF NOT EXISTS "idx_codigos_verificacao_data_expiracao" 
    ON "codigos_verificacao"("data_expiracao");

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
