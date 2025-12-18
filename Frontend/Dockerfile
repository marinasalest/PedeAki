FROM node:18-alpine

WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache git

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências do projeto
# Usa npm install se não houver package-lock.json, caso contrário npm ci
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia o resto do código
COPY . .

# Expõe a porta
EXPOSE 3001

# Define variáveis de ambiente
ENV PORT=3001
ENV REACT_APP_API_URL=http://localhost:3000

# Inicia o servidor
CMD ["npm", "start"]












