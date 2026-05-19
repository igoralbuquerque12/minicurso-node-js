# Git e GitHub - Guia Introdutório

## O que é Git?
Git é um **sistema de controle de versão distribuído** que permite:

- rastrear mudanças no código
- voltar versões anteriores
- trabalhar com branches
- colaborar com outras pessoas sem sobrescrever trabalho

Em resumo: **Git controla o histórico do seu projeto.**

---

## O que é GitHub?
GitHub é uma **plataforma online que hospeda repositórios Git**.

Com ele você pode:

- armazenar código na nuvem
- compartilhar projetos
- colaborar com times
- abrir Pull Requests
- revisar código
- rodar CI/CD

Em resumo: **Git é a ferramenta; GitHub é onde normalmente compartilhamos o código.**

---

# Os 3 estágios do Git

![Git stages](https://git-scm.com/book/en/v2/images/areas.png)

Pense no Git como 3 áreas:

```text
GitHub (Remoto)
      ↑ ↓
Commit History (Local Repository)
      ↑
Staging Area (git add)
      ↑
Working Directory (seus arquivos)
```

---

## 1) Working Directory (Sua máquina / arquivos locais)

É onde você trabalha normalmente.

**Aqui você:**
- Cria arquivos
- Edita código
- Apaga arquivos
- Renomeia coisas

**Exemplo:**
```bash
touch index.js
```

Ou editar:
```javascript
console.log("Olá");
```

Nesse momento o Git percebe: "Esse arquivo mudou." Mas ainda não faz parte do próximo commit.

**Resumo:**
- Mudança existe
- Git detecta
- Ainda não foi preparada

---

## 2) Staging Area (Área intermediária / git add)

Essa é a área de preparação.

Quando você roda:
```bash
git add index.js
```

Você está dizendo: "Quero incluir essa alteração no próximo commit."

É como selecionar arquivos antes de salvar oficialmente.

**Resumo:**
- Mudanças selecionadas
- Prontas para commit
- Ainda podem ser alteradas

---

## 3) Local Repository (Histórico local)

Quando você roda:
```bash
git commit -m "feat: adiciona log inicial"
```

O Git cria um snapshot da staging area.

Agora a mudança:
- Entrou no histórico
- Virou uma versão oficial
- Existe na sua máquina

**Resumo:**
- Histórico salvo localmente
- Ainda não foi para GitHub

---

## 4) Remote Repository (GitHub)

Quando você roda:
```bash
git push
```

As mudanças sobem para o repositório remoto (normalmente GitHub).

**Resumo:**
- Código compartilhado
- Time consegue acessar
- Backup remoto

---

## Fluxo visual

```
[ Working Directory ]
      |
      | git add
      ↓
[ Staging Area ]
      |
      | git commit
      ↓
[ Local Repository ]
      |
      | git push
      ↓
[ GitHub / Remote ]
```

Para atualizar sua máquina:
```
[ GitHub ]
    |
    | git pull
    ↓
[ Sua máquina ]
```

---

# Comandos principais
## git add

**O que faz:** Move alterações da Working Directory para a Staging Area.

**Sintaxe:**
```bash
# Arquivo específico:
git add arquivo.js

# Tudo:
git add .
```

**Quando usar:**
- Depois de editar arquivo
- Depois de criar arquivo
- Depois de apagar arquivo

**Exemplo:**

Você alterou `app.js` e `auth.js`. 

Adicionar só um:
```bash
git add app.js
```

Adicionar tudo:
```bash
git add .
```

**Resumo:** "Preparar mudanças para commit."

---

## git commit

**O que faz:** Cria uma versão oficial no histórico local.

**Sintaxe:**
```bash
git commit -m "mensagem"
```

**Exemplo:**
```bash
git commit -m "feat: adiciona autenticação JWT"
```

**Quando usar:** Depois de organizar o que entrou com `git add`.

**O que acontece:**

Git salva:
- Arquivos staged
- Mensagem descritiva
- Snapshot daquele momento

**Resumo:** "Salvar oficialmente no histórico."

---

## git push

**O que faz:** Envia commits locais para o GitHub.

**Sintaxe:**
```bash
git push origin main
# Ou (se upstream já configurado):
git push
```

**Quando usar:** Quando quiser publicar mudanças.

**O que acontece:**

| Antes | Depois |
|-------|--------|
| Seu PC tem commits novos | GitHub atualizado |
| GitHub não tem essas mudanças | |

**Resumo:** "Subir mudanças para o remoto."

---

## git pull

**O que faz:** Baixa mudanças do remoto e integra no branch atual.

Na prática: `git fetch + git merge`

**Sintaxe:**
```bash
git pull origin main
```

**Quando usar:**
- Antes de começar trabalho novo
- Quando alguém atualizou o projeto

**O que acontece:** Git pega mudanças do GitHub e mistura com sua branch.

**Resumo:** "Atualizar minha máquina com o remoto."

---

## git checkout / git switch

### git switch (moderno)

**Trocar branch:**
```bash
git switch develop
```

**Criar e entrar:**
```bash
git switch -c feature/login
```

### git checkout (antigo)

**Trocar branch:**
```bash
git checkout develop
```

**Criar e entrar:**
```bash
git checkout -b feature/login
```

### Diferença

`checkout` fazia várias coisas (confuso):
- Trocar branch
- Restaurar arquivos
- Navegar commits

`switch` veio para deixar claro: "Isso aqui é só branch."

**Quando usar:**

Criar funcionalidade:
```bash
git switch -c feature/pagamento
```

Voltar:
```bash
git switch main
```

**Resumo:** "Mudar de contexto de trabalho."

---

## git status

**O que faz:** Mostra o estado atual do repositório.

**Sintaxe:**
```bash
git status
```

**O que você vê:**
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  modified:   app.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
  config.env

nothing added to commit but untracked files present (working tree modified)
```

**Interpretação:**

- **Changes not staged:** Arquivos modificados, mas não adicionados com `git add`
- **Untracked files:** Arquivos que Git não conhece (novos)
- **Changes to be committed:** Arquivos na staging area, prontos para commit

**Quando usar:** Sempre que quiser entender o estado atual do seu projeto.

**Resumo:** "Ver o que mudou, o que está staged e o que não está rastreado."

---

## git diff

**O que faz:** Mostra as diferenças entre versões.

**Sintaxe:**

Ver o que mudou mas ainda não foi `git add`:
```bash
git diff
```

Ver o que mudou e já foi `git add`:
```bash
git diff --staged
```

**Exemplo de saída:**
```diff
diff --git a/app.js b/app.js
index 1234567..abcdefg 100644
--- a/app.js
+++ b/app.js
@@ -5,6 +5,8 @@
 console.log("Iniciando...");
 
+// novo comentário
+console.log("Configurado");
+
 app.listen(3000);
```

Linhas com `+` foram adicionadas.
Linhas com `-` foram removidas.

**Quando usar:**
- Revisar o que você alterou antes de commitar
- Entender exatamente qual mudança foi feita
- Comparar branches

**Resumo:** "Ver linha por linha o que mudou."

---

## Untracked files

**O que é:**

Um arquivo "untracked" é aquele que Git não está rastreando.

Isso acontece quando:
- Você cria um novo arquivo
- Git nunca fez `git add` nele antes
- Ele não está no `.gitignore`

**Exemplo:**

```bash
touch config.env
```

Agora rode:
```bash
git status
```

Você verá:
```
Untracked files:
  config.env
```

**O que significa:**

Git vê o arquivo, mas **não está monitorando mudanças** nele.

Se você alterar `config.env`, Git não vai rastrear essas mudanças até você rodar `git add config.env`.

**Como rastrear:**

```bash
git add config.env
```

Agora Git vai monitorar esse arquivo.

**Quando aparecem:**

- Arquivos novos que você criou
- Arquivos de dependências (`node_modules` - mas normalmente no `.gitignore`)
- Arquivos de configuração local
- Qualquer coisa que você criar manualmente

**Resumo:** "Arquivos que existem mas Git ainda não está observando."

---

# Pull Request (PR)
# Pull Request (PR)

**O que é:**

É um pedido para juntar mudanças de uma branch em outra.

Exemplo: `feature/login → main`

Você desenvolve separado e depois pede merge.

---

## Fluxo

1. **Criar branch:**
   ```bash
   git switch -c feature/login
   ```

2. **Desenvolver:**
   ```bash
   git add .
   ```

3. **Commitar:**
   ```bash
   git commit -m "feat: adiciona login"
   ```

4. **Enviar:**
   ```bash
   git push origin feature/login
   ```

5. **Abrir Pull Request no GitHub**

6. **Revisão de código**

7. **Merge**

---

## Por que usar

Permite:
- Revisão por colegas
- Comentários
- Aprovação
- CI/CD
- Histórico limpo
- Segurança antes de merge

---

## Exemplo real

**Branch criada:** `feature/auth-jwt`

**PR:** `feature/auth-jwt → main`

**Descrição:** "Adiciona autenticação JWT e middleware de proteção"

Time revisa e aprova. Depois merge.

**Resumo:** "Solicitação formal para integrar código."

---

# # Fluxo completo real

```bash
git pull origin main

git switch -c feature/cadastro

# altera código

git add .

git commit -m "feat: adiciona tela de cadastro"

git push origin feature/cadastro
```

Depois no GitHub:

1. Open Pull Request
2. Review
3. Approve
4. Merge

---

# Resumo final rápido

| Área | Função |
|------|--------|
| **Working Directory** | Onde você altera arquivos |
| **Staging Area** | O que foi selecionado com `git add` |
| **Local Repository** | Histórico salvo com `commit` |
| **Remote Repository** | GitHub |

**Fluxo:**
```
editar → git add → git commit → git push
```

**Atualizar:**
```
git pull
```