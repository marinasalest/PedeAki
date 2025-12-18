const { execSync } = require('child_process');
const path = require('path');

const scriptsDir = __dirname;

console.log('🌱 Iniciando seed completo de todas as tabelas...\n');
console.log('📋 Ordem de execução:');
console.log('   1. Categorias');
console.log('   2. Endereços + Usuários');
console.log('   3. Endereços + Restaurantes');
console.log('   4. Produtos');
console.log('   5. Pedidos + Avaliações + Pagamentos\n');

const scripts = [
  { name: 'Categorias', file: 'seed-categorias.js' },
  { name: 'Restaurantes (com endereços)', file: 'seed-restaurantes.js' },
  { name: 'Usuários (com endereços)', file: 'seed-clientes.js' },
  { name: 'Produtos', file: 'seed-produtos.js' },
  { name: 'Pedidos, Avaliações e Pagamentos', file: 'seed-pedidos-avaliacoes.js' }
];

try {
  for (const script of scripts) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Executando: ${script.name}`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
      execSync(`node "${path.join(scriptsDir, script.file)}"`, {
        stdio: 'inherit',
        cwd: path.join(scriptsDir, '..')
      });
      console.log(`\n✅ ${script.name} concluído com sucesso!`);
    } catch (error) {
      console.error(`\n❌ Erro ao executar ${script.name}:`, error.message);
      throw error;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('🎉 Seed completo finalizado com sucesso!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📊 Tabelas populadas:');
  console.log('   ✅ categorias');
  console.log('   ✅ enderecos');
  console.log('   ✅ usuarios');
  console.log('   ✅ restaurantes');
  console.log('   ✅ produtos');
  console.log('   ✅ pedidos');
  console.log('   ✅ pagamentos');
  console.log('   ✅ avaliacoes\n');
} catch (error) {
  console.error('\n❌ Erro durante o seed:', error.message);
  process.exit(1);
}












