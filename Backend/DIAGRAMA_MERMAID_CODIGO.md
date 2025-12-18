# Código Mermaid - Diagrama de Arquitetura Pede Aki

## Código Completo para Copiar

```mermaid
graph TD
    subgraph "3. Diagrama de Arquitetura: Pede Aki"
        direction TB

        subgraph "Ambiente de Execução Local"
            OS_USER[("Sistema Operacional: Windows 10.0.26100<br/>Shell: PowerShell")]
            DOCKER[("Docker Desktop v28.0.1<br/>Docker Compose (incluso)")]
            OS_USER --> DOCKER
        end

        subgraph "Contêineres da Aplicação (Orquestração: Docker Compose)"
            F_APP("FRONTEND<br/>React v18.2.0")
            B_APP("BACKEND<br/>Node.js v18<br/>Express v4.18.2")
            DB_APP("BANCO DE DADOS<br/>PostgreSQL v15-alpine")

            subgraph "Detalhes do FRONTEND"
                style F_APP_DETAILS fill:#e0f7fa,stroke:#00796b,stroke-width:1px
                F_OS[("SO do Contêiner: Linux<br/>(Node.js v18 base image)")]
                F_REACT("React v18.2.0")
                F_ROUTER("React Router DOM v6.20.1")
                F_SCRIPTS("React Scripts v5.0.1")
                F_TS("TypeScript v4.9.5")
                F_AXIOS("Axios v1.6.2")
                F1(Login)
                F2(Cadastro)
                F3(Dashboard)
                F4(Restaurantes)
                F5(Produtos)
                F6(Pedidos)
                F_APP --> F_OS & F_REACT & F_ROUTER & F_SCRIPTS & F_TS & F_AXIOS
                F_APP --> F1 & F2 & F3 & F4 & F5 & F6
            end

            subgraph "Detalhes do BACKEND"
                style B_APP_DETAILS fill:#e8f5e9,stroke:#388e3c,stroke-width:1px
                B_OS[("SO do Contêiner: Linux<br/>(Node.js v18 base image<br/>debian-openssl-3.0.x)")]
                B_CTRL("Controllers")
                B_SVC("Services")
                B_MW("Middleware")
                B_RTR("Router")
                B_AUTH("Auth:<br/>JWT v9.0.3<br/>bcryptjs v2.4.3<br/>Passport v0.7.0")
                B_UPLD("Upload: Multer v1.4.5-lts.1")
                B_ORM("ORM: Prisma v5.7.0<br/>@prisma/client v5.7.0")
                B_SWAGGER("Swagger:<br/>swagger-jsdoc v6.2.8<br/>swagger-ui-express v5.0.0")
                B_TS("TypeScript v5.3.3")
                B_EXPRESS("Express v4.18.2")
                B_APP --> B_OS & B_CTRL & B_SVC & B_MW & B_RTR & B_AUTH & B_UPLD & B_ORM & B_SWAGGER & B_TS & B_EXPRESS
            end

            subgraph "Detalhes do BANCO DE DADOS"
                style DB_APP_DETAILS fill:#fffde7,stroke:#fbc02d,stroke-width:1px
                D_OS[("SO do Contêiner: Linux Alpine<br/>(PostgreSQL v15-alpine)")]
                D_VERSION("PostgreSQL v15")
                D1(Usuarios)
                D2(Restaurantes)
                D3(Produtos)
                D4(Pedidos)
                D5(Pagamentos)
                D6(Avaliações)
                D7(Endereços)
                D8(Categorias)
                DB_APP --> D_OS & D_VERSION
                DB_APP --> D1 & D2 & D3 & D4 & D5 & D6 & D7 & D8
            end
        end

        subgraph "SERVIÇOS EXTERNOS"
            style EXT_SERVICES fill:#fce4ec,stroke:#d81b60,stroke-width:2px
            E1("Facebook API<br/>(Versão gerenciada pelo provedor<br/>passport-facebook v3.0.0)")
            E2("Google OAuth 2.0 API<br/>(Versão gerenciada pelo provedor<br/>passport-google-oauth20 v2.0.0)")
            E3("Stripe Payment API<br/>(Versão gerenciada pelo provedor)")
            E4("Google Maps Geocoding API<br/>(Axios v1.6.2 para requisições)")
            E5("Twilio API v5.10.7<br/>(SMS/WhatsApp)")
            E6("Nodemailer v7.0.11<br/>(Email)")
        end

        DOCKER --- "Orquestra e Gerencia" --> F_APP
        DOCKER --- "Orquestra e Gerencia" --> B_APP
        DOCKER --- "Orquestra e Gerencia" --> DB_APP

        F_APP --- "HTTP/HTTPS<br/>Axios v1.6.2" --> B_APP
        B_APP --- "API Externa<br/>passport-facebook v3.0.0" --> E1
        B_APP --- "API Externa<br/>passport-google-oauth20 v2.0.0" --> E2
        B_APP --- "API Externa<br/>Stripe SDK" --> E3
        B_APP --- "API Externa<br/>Axios v1.6.2" --> E4
        B_APP --- "API Externa<br/>Twilio SDK v5.10.7" --> E5
        B_APP --- "SMTP<br/>Nodemailer v7.0.11" --> E6
        B_APP --- "Prisma ORM v5.7.0<br/>PostgreSQL Protocol" --> DB_APP
    end
```

## Resumo das Versões

### Ambiente
- **Sistema Operacional**: Windows 10.0.26100
- **Docker Desktop**: v28.0.1
- **Docker Compose**: Incluso no Docker Desktop

### Frontend
- **React**: v18.2.0
- **React Router DOM**: v6.20.1
- **React Scripts**: v5.0.1
- **TypeScript**: v4.9.5
- **Axios**: v1.6.2

### Backend
- **Node.js**: v18
- **Express**: v4.18.2
- **TypeScript**: v5.3.3
- **Prisma**: v5.7.0
- **@prisma/client**: v5.7.0
- **JWT (jsonwebtoken)**: v9.0.3
- **bcryptjs**: v2.4.3
- **Passport**: v0.7.0
- **passport-facebook**: v3.0.0
- **passport-google-oauth20**: v2.0.0
- **Multer**: v1.4.5-lts.1
- **swagger-jsdoc**: v6.2.8
- **swagger-ui-express**: v5.0.0
- **Axios**: v1.6.2
- **Twilio**: v5.10.7
- **Nodemailer**: v7.0.11

### Banco de Dados
- **PostgreSQL**: v15-alpine

### Serviços Externos
- **Facebook API**: Versão gerenciada pelo provedor (passport-facebook v3.0.0)
- **Google OAuth 2.0 API**: Versão gerenciada pelo provedor (passport-google-oauth20 v2.0.0)
- **Stripe Payment API**: Versão gerenciada pelo provedor
- **Google Maps Geocoding API**: Via Axios v1.6.2
- **Twilio API**: v5.10.7
- **Nodemailer**: v7.0.11
