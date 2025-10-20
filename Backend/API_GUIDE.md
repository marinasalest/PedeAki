# 📖 Guia de Uso da API PedeAki

Este documento fornece exemplos práticos de como usar a API do PedeAki.

## 🚀 Iniciando

### 1. Criar um Endereço

```bash
curl -X POST http://localhost:3000/endereco \
  -H "Content-Type: application/json" \
  -d '{
    "rua": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  }'
```

### 2. Criar um Usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "data_nascimento": "1990-01-01",
    "email": "joao@email.com",
    "password": "senha123",
    "enderecoId": "ID_DO_ENDERECO_CRIADO"
  }'
```

### 3. Fazer Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### 4. Criar uma Categoria

```bash
curl -X POST http://localhost:3000/categoria \
  -H "Content-Type: application/json" \
  -d '{
    "id": "LANCHE",
    "name": "Lanches"
  }'
```

### 5. Criar um Restaurante

```bash
curl -X POST http://localhost:3000/restaurante \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Burger King",
    "cnpj": "12.345.678/0001-90",
    "nome_fantasia": "BK",
    "senha": "senha123",
    "telefone": "(11) 99999-9999",
    "email": "bk@email.com",
    "avaliacao": 4.5,
    "enderecoId": "ID_DO_ENDERECO"
  }'
```

### 6. Criar um Produto (com imagem)

```bash
curl -X POST http://localhost:3000/produto \
  -F "name_produto=Hambúrguer Clássico" \
  -F "preco=25.90" \
  -F "descricao=Hambúrguer com carne, queijo, alface e tomate" \
  -F "id_restaurante=ID_DO_RESTAURANTE" \
  -F "id_categoria=LANCHE" \
  -F "file=@caminho/para/imagem.jpg"
```

## 📋 Listando Dados

### Listar Todos os Usuários

```bash
curl -X GET http://localhost:3000/usuarios
```

### Listar Todos os Restaurantes

```bash
curl -X GET http://localhost:3000/allRestaurantes
```

### Listar Todas as Categorias

```bash
curl -X GET http://localhost:3000/allCategorias
```

### Buscar Usuário por ID

```bash
curl -X GET http://localhost:3000/usuario/ID_DO_USUARIO
```

## ✏️ Atualizando Dados

### Atualizar Usuário

```bash
curl -X PUT http://localhost:3000/usuario/ID_DO_USUARIO \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "password": "novasenha123"
  }'
```

### Atualizar Categoria

```bash
curl -X PUT http://localhost:3000/categoria/LANCHE \
  -H "Content-Type: application/json" \
  -d '{
    "id": "LANCHE",
    "name": "Lanches e Sanduíches"
  }'
```

## 🗑️ Deletando Dados

### Deletar Usuário

```bash
curl -X DELETE http://localhost:3000/usuario/ID_DO_USUARIO
```

### Deletar Categoria

```bash
curl -X DELETE http://localhost:3000/categoria/LANCHE
```

## 🔍 Respostas da API

### Sucesso (200)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "data_nascimento": "1990-01-01T00:00:00.000Z",
    "email": "joao@email.com"
  }
}
```

### Erro (400/500)

```json
{
  "error": "Mensagem de erro"
}
```

## 📊 Status Codes

- **200** - Sucesso
- **201** - Criado com sucesso
- **204** - Deletado com sucesso
- **400** - Erro de validação
- **404** - Não encontrado
- **500** - Erro interno do servidor

## 🛠️ Ferramentas Recomendadas

### Postman
- Importe a coleção da API
- Configure variáveis de ambiente
- Teste todos os endpoints

### Insomnia
- Interface amigável para testes
- Suporte a diferentes tipos de requisição
- Histórico de requisições

### curl
- Linha de comando
- Scripts automatizados
- Testes rápidos

## 🔐 Segurança

- Senhas são criptografadas com bcrypt
- Validação de dados de entrada
- Tratamento de erros padronizado
- CORS configurado

## 📝 Notas Importantes

1. **IDs**: Todos os IDs são UUIDs (exceto categorias)
2. **Datas**: Use formato ISO 8601 (YYYY-MM-DD)
3. **Upload**: Imagens são salvas na pasta `tmp/`
4. **Validação**: CPF e email devem ser únicos
5. **Relacionamentos**: Endereços são obrigatórios para usuários e restaurantes

## 🆘 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute as migrações: `npm run prisma:migrate`

### Erro de Upload
- Verifique se a pasta `tmp/` existe
- Confirme permissões de escrita
- Verifique o tamanho do arquivo

### Erro de Validação
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme formatos de data e email
- Verifique se CPF e email são únicos

---

Para mais informações, consulte a documentação Swagger em `/api-docs`
