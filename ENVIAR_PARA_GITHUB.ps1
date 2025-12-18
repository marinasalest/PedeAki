# Script para enviar o projeto PedeAki para o GitHub
# Execute este script na pasta raiz do projeto

Write-Host "=== Configurando Git e enviando para GitHub ===" -ForegroundColor Green

# Verificar se o Git está instalado
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Git não está instalado!" -ForegroundColor Red
    exit 1
}

# Verificar se já é um repositório Git
if (Test-Path .git) {
    Write-Host "Repositório Git já inicializado" -ForegroundColor Yellow
} else {
    Write-Host "Inicializando repositório Git..." -ForegroundColor Cyan
    git init
}

# Configurar remote (se não existir)
$remoteUrl = "https://github.com/marinasalest/PedeAki.git"
$currentRemote = git remote get-url origin 2>$null

if ($LASTEXITCODE -eq 0) {
    if ($currentRemote -ne $remoteUrl) {
        Write-Host "Atualizando remote origin..." -ForegroundColor Cyan
        git remote set-url origin $remoteUrl
    } else {
        Write-Host "Remote origin já configurado corretamente" -ForegroundColor Green
    }
} else {
    Write-Host "Adicionando remote origin..." -ForegroundColor Cyan
    git remote add origin $remoteUrl
}

# Verificar status
Write-Host "`nVerificando status do repositório..." -ForegroundColor Cyan
git status

# Adicionar todos os arquivos
Write-Host "`nAdicionando todos os arquivos..." -ForegroundColor Cyan
git add .

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ($status) {
    Write-Host "`nCriando commit..." -ForegroundColor Cyan
    git commit -m "Atualização completa do projeto PedeAki com todas as funcionalidades e documentação"
    
    Write-Host "`nEnviando para o GitHub..." -ForegroundColor Cyan
    Write-Host "NOTA: Se for a primeira vez, você precisará fazer push com:" -ForegroundColor Yellow
    Write-Host "  git push -u origin master" -ForegroundColor Yellow
    Write-Host "`nOu se a branch principal for 'main':" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
    
    # Tentar push
    Write-Host "`nTentando push para origin/master..." -ForegroundColor Cyan
    git push -u origin master 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`nTentando push para origin/main..." -ForegroundColor Cyan
        git push -u origin main 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Projeto enviado com sucesso para o GitHub!" -ForegroundColor Green
        Write-Host "URL: https://github.com/marinasalest/PedeAki" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Push falhou. Verifique:" -ForegroundColor Yellow
        Write-Host "  1. Se você está autenticado no GitHub" -ForegroundColor Yellow
        Write-Host "  2. Se tem permissão para fazer push no repositório" -ForegroundColor Yellow
        Write-Host "  3. Execute manualmente: git push -u origin master (ou main)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nNenhuma mudança para commitar. Tudo está atualizado!" -ForegroundColor Green
}

Write-Host "`n=== Concluído ===" -ForegroundColor Green
