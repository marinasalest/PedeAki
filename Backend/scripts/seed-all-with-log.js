const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scriptsDir = __dirname;
const logFile = path.join(scriptsDir, '..', 'seed-log.txt');

// Limpa o arquivo de log anterior
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

log('🌱 Iniciando seed completo de todas as tabelas...\n');
log('📋 Ordem de execução:');
log('   1. Categorias');
log('   2. Endereços + Usuários');
log('   3. Endereços + Restaurantes');
log('   4. Produtos');
log('   5. Pedidos + Avaliações + Pagamentos\n');

const scripts = [
  { name: 'Categorias', file: 'seed-categorias.js' },
  { name: 'Restaurantes (com endereços)', file: 'seed-restaurantes.js' },
  { name: 'Usuários (com endereços)', file: 'seed-clientes.js' },
  { name: 'Produtos', file: 'seed-produtos.js' },
  { name: 'Pedidos, Avaliações e Pagamentos', file: 'seed-pedidos-avaliacoes.js' }
];

try {
  for (const script of scripts) {
    log(`\n${'='.repeat(60)}`);
    log(`📦 Executando: ${script.name}`);
    log(`${'='.repeat(60)}\n`);
    
    try {
      const output = execSync(`node "${path.join(scriptsDir, script.file)}"`, {
        encoding: 'utf8',
        cwd: path.join(scriptsDir, '..'),
        stdio: 'pipe'
      });
      
      if (output) {
        log(output);
      }
      log(`\n✅ ${script.name} concluído com sucesso!`);
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || error.message;
      log(`\n❌ Erro ao executar ${script.name}:`);
      log(errorOutput);
      throw error;
    }
  }

  log(`\n${'='.repeat(60)}`);
  log('🎉 Seed completo finalizado com sucesso!');
  log(`${'='.repeat(60)}\n`);
  log('📊 Tabelas populadas:');
  log('   ✅ categorias');
  log('   ✅ enderecos');
  log('   ✅ usuarios');
  log('   ✅ restaurantes');
  log('   ✅ produtos');
  log('   ✅ pedidos');
  log('   ✅ pagamentos');
  log('   ✅ avaliacoes\n');
  log(`\n📝 Log completo salvo em: ${logFile}`);
} catch (error) {
  log('\n❌ Erro durante o seed:');
  log(error.message);
  log(`\n📝 Log completo salvo em: ${logFile}`);
  process.exit(1);
}












