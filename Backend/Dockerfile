FROM node:18

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências
RUN npm ci

# Gera Prisma Client
RUN npx prisma generate

# Copia o resto do código
COPY . .

# Expõe a porta
EXPOSE 3000

# NÃO define CMD ou ENTRYPOINT aqui - será definido no docker-compose.yml

