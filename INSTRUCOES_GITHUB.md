# Instruções para Enviar o Projeto para o GitHub

## Opção 1: Usar o Script Automático (Recomendado)

Execute o script PowerShell na pasta raiz do projeto:

```powershell
.\ENVIAR_PARA_GITHUB.ps1
```

## Opção 2: Comandos Manuais

Se o script não funcionar, execute estes comandos manualmente:

### 1. Navegar até a pasta do projeto
```powershell
cd "d:\Documents\pedeaki]\novo\PedeAki"
```

### 2. Inicializar Git (se ainda não foi feito)
```powershell
git init
```

### 3. Adicionar remote do GitHub
```powershell
git remote add origin https://github.com/marinasalest/PedeAki.git
```

Ou se já existir, atualizar:
```powershell
git remote set-url origin https://github.com/marinasalest/PedeAki.git
```

### 4. Adicionar todos os arquivos
```powershell
git add .
```

### 5. Criar commit
```powershell
git commit -m "Atualização completa do projeto PedeAki com todas as funcionalidades e documentação"
```

### 6. Enviar para o GitHub

**Se a branch principal for `master`:**
```powershell
git push -u origin master
```

**Se a branch principal for `main`:**
```powershell
git push -u origin main
```

**Se der erro de branch, criar e enviar:**
```powershell
git branch -M main
git push -u origin main
```

## ⚠️ Problemas Comuns

### Erro: "Authentication failed"

Você precisa autenticar no GitHub. Opções:

1. **Usar Personal Access Token**:
   - Vá em GitHub → Settings → Developer settings → Personal access tokens
   - Crie um token com permissão `repo`
   - Use o token como senha ao fazer push

2. **Usar GitHub CLI**:
   ```powershell
   gh auth login
   ```

3. **Configurar credenciais**:
   ```powershell
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

### Erro: "Repository not found"

Verifique se:
- O repositório existe no GitHub
- Você tem permissão para fazer push
- A URL do remote está correta

### Erro: "Branch diverged"

Se o repositório remoto já tem commits:
```powershell
git pull origin master --allow-unrelated-histories
# ou
git pull origin main --allow-unrelated-histories
```

Depois tente o push novamente.

## ✅ Verificar se Funcionou

Após o push, acesse:
https://github.com/marinasalest/PedeAki

Você deve ver todos os arquivos do projeto lá!
