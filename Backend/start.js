#!/usr/bin/env node

console.log('========================================');
console.log('🔍 DIAGNÓSTICO INICIAL');
console.log('========================================');
console.log('Diretório atual:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Arquivos no diretório:');

const fs = require('fs');
const path = require('path');

try {
  const files = fs.readdirSync(process.cwd());
  console.log('Arquivos encontrados:', files.slice(0, 20).join(', '));
  console.log('Total de arquivos:', files.length);
  
  // Verifica se start.js existe
  const startJsPath = path.join(process.cwd(), 'start.js');
  console.log('start.js existe?', fs.existsSync(startJsPath));
  console.log('start.js caminho completo:', startJsPath);
  
  // Verifica se package.json existe
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  console.log('package.json existe?', fs.existsSync(packageJsonPath));
  
  // Verifica se node_modules existe
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  console.log('node_modules existe?', fs.existsSync(nodeModulesPath));
  
  // Verifica se prisma existe
  const prismaPath = path.join(process.cwd(), 'prisma');
  console.log('prisma existe?', fs.existsSync(prismaPath));
  
} catch (error) {
  console.error('❌ Erro ao ler diretório:', error.message);
}

console.log('========================================');
console.log('🚀 INICIANDO APLICAÇÃO');
console.log('========================================');

const { execSync } = require('child_process');

async function start() {
  try {
    console.log('📦 Verificando Prisma Client...');
    let PrismaClient;
    try {
      PrismaClient = require('@prisma/client').PrismaClient;
      console.log('✅ Prisma Client carregado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar Prisma Client:', error.message);
      console.log('📦 Tentando gerar Prisma Client...');
      try {
        execSync('npx prisma generate', { stdio: 'inherit', cwd: process.cwd() });
        PrismaClient = require('@prisma/client').PrismaClient;
        console.log('✅ Prisma Client gerado e carregado');
      } catch (genError) {
        console.error('❌ Erro ao gerar Prisma Client:', genError.message);
        throw genError;
      }
    }

    const prisma = new PrismaClient();

    console.log('⏳ Aguardando PostgreSQL...');
    let dbReady = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!dbReady && attempts < maxAttempts) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        dbReady = true;
        console.log('✅ PostgreSQL está pronto!');
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`   Tentativa ${attempts}/${maxAttempts}... Erro: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw new Error(`PostgreSQL não está acessível após ${maxAttempts} tentativas. Último erro: ${error.message}`);
        }
      }
    }

    console.log('📦 Executando migrações...');
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit', 
        cwd: process.cwd(),
        env: process.env
      });
      console.log('✅ Migrações executadas com sucesso');
    } catch (error) {
      console.log('⚠️  Migrate deploy falhou, tentando db push...');
      try {
        execSync('npx prisma db push --skip-generate', { 
          stdio: 'inherit', 
          cwd: process.cwd(),
          env: process.env
        });
        console.log('✅ db push executado com sucesso');
      } catch (pushError) {
        console.error('❌ Erro ao executar db push:', pushError.message);
        throw pushError;
      }
    }

    console.log('🔍 Verificando se o banco já possui dados...');
    const categoriasCount = await prisma.categorias.count();
    console.log(`📊 Categorias encontradas: ${categoriasCount}`);
    
    if (categoriasCount === 0) {
      console.log('📊 Banco vazio detectado. Populando dados iniciais...');
      try {
        console.log('📦 Executando seed-from-json.js...');
        execSync('node scripts/seed-from-json.js', { 
          stdio: 'inherit', 
          cwd: process.cwd(),
          env: process.env
        });
        console.log('📦 Executando seed-produtos.js...');
        execSync('node scripts/seed-produtos.js', { 
          stdio: 'inherit', 
          cwd: process.cwd(),
          env: process.env
        });
        console.log('📦 Executando seed-pedidos-avaliacoes.js...');
        execSync('node scripts/seed-pedidos-avaliacoes.js', { 
          stdio: 'inherit', 
          cwd: process.cwd(),
          env: process.env
        });
        console.log('✅ Todos os dados iniciais populados com sucesso!');
      } catch (error) {
        console.error('⚠️  Erro ao popular dados (continuando mesmo assim):', error.message);
        console.error('Stack:', error.stack);
      }
    } else {
      console.log('✅ Banco já possui dados. Pulando seed.');
    }

    await prisma.$disconnect();
    console.log('✅ Prisma desconectado');

    console.log('🚀 Iniciando servidor Node.js...');
    console.log('📝 Comando: npm run dev');
    console.log('📝 Diretório:', process.cwd());
    console.log('📝 Node version:', process.version);
    console.log('========================================');
    
    execSync('npm run dev', { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      env: process.env
    });

  } catch (error) {
    console.error('========================================');
    console.error('❌ ERRO CRÍTICO');
    console.error('========================================');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('========================================');
    if (typeof prisma !== 'undefined') {
      await prisma.$disconnect().catch(() => {});
    }
    process.exit(1);
  }
}

start();

