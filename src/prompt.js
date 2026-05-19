function formatUserSummary(userSummary) {
  if (!userSummary || userSummary.length === 0) {
    return "O usuario nao escreveu um resumo. Use apenas os dados do Git.";
  }

  return userSummary.map(item => `- ${item}`).join("\n");
}

function formatBlock(value, emptyMessage) {
  if (!value || value.trim().length === 0) {
    return emptyMessage;
  }

  return value.trim();
}

function formatPrInstruction(config) {
  if (!config.createPR) {
    return "Pull Request desativado na configuracao.";
  }

  return `
Gere a SECTION 3: PULL REQUEST DATA.

Use este template configurado como referencia, mas mantenha obrigatoriamente
a estrutura pedida abaixo:

${config.prTemplate}
`.trim();
}

export function buildPrompt({
  config,
  entry,
  diff,
  stagedDiff = "",
  gitStatus = "",
  untrackedFiles
}) {
  return `
Voce e um arquiteto de software especialista em Git, revisao de Pull Requests
e organizacao de commits atomicos.

Sua tarefa e analisar as alteracoes de um projeto e gerar um plano em Markdown
com EXATAMENTE 3 secoes:

1. SECTION 1: ANALYSIS (Internal Monologue)
2. SECTION 2: EXECUTION SCRIPT
3. SECTION 3: PULL REQUEST DATA

Responda somente com o Markdown final. Nao adicione introducao, conclusao,
observacoes fora das secoes ou explicacoes extras.

REGRAS GERAIS
- Use somente UMA branch.
- Use exatamente este nome de branch: ${entry.branchName}
- Organize os commits em camadas logicas e em ordem segura de execucao.
- Mudancas sem relacao direta com a feature principal devem vir primeiro em
  "Layer 1: Unrelated Refactor/Fixes".
- Para features com arquitetura em camadas, prefira esta ordem quando fizer
  sentido: refactors isolados -> services/core -> controllers/routes -> module
  integrations -> autorizacao/configuracoes cross-cutting -> documentacao ->
  testes.
- Cada commit deve ser pequeno, revisavel e com arquivos que fazem sentido juntos.
- Nao crie commits grandes misturando documentacao, testes, configuracao e codigo
  funcional quando eles puderem ser revisados separadamente.
- Mensagens de commit devem usar Conventional Commits em ingles:
  feat(scope): message
  fix(scope): message
  refactor(scope): message
  chore(scope): message
  docs(scope): message
  test(scope): message
- Use scopes curtos baseados no modulo, pasta ou responsabilidade principal.
- Nao invente arquivos que nao aparecam no status, diff ou lista de untracked.
- Se um arquivo novo aparecer sem conteudo no diff, use o caminho e o resumo do
  usuario para inferir o melhor commit.

SECTION 1: ANALYSIS (Internal Monologue)
- O titulo deve ser exatamente:
  ### SECTION 1: ANALYSIS (Internal Monologue)
- Nao escreva raciocinio longo.
- Escreva apenas uma linha no formato:
  Layers: [1. Nome da camada] -> [2. Nome da camada] -> [3. Nome da camada]
- As camadas devem refletir os grupos reais dos commits que voce vai gerar.

SECTION 2: EXECUTION SCRIPT
- O titulo deve ser exatamente:
  ### SECTION 2: EXECUTION SCRIPT
- Gere um unico bloco \`\`\`bash.
- A primeira linha do script deve ser:
  git checkout -b "${entry.branchName}"
- Separe os grupos com comentarios:
  # Layer 1: Nome da camada
  # Nome do modulo, quando ajudar a leitura
- Para cada commit, use este formato:
  git add "arquivo-1" "arquivo-2"
  git commit -m "tipo(scope): mensagem"
- Nao use git add ., git add -A, wildcards ou caminhos sem aspas.
- Cada arquivo alterado deve aparecer no git add do commit mais adequado.
- A ultima linha do script deve ser:
  git push origin ${entry.branchName}

SECTION 3: PULL REQUEST DATA
- O titulo deve ser exatamente:
  ### SECTION 3: PULL REQUEST DATA
- Se Pull Request estiver desativado, escreva somente:
  Pull Request desativado na configuracao.
- Se Pull Request estiver ativado, use exatamente esta estrutura:
  ---
  **BRANCH: ${entry.branchName}**

  ## Descrição
  Escreva em português uma descrição objetiva do objetivo da PR.

  ## Problemas
  Liste os problemas, motivações ou dores que justificam a mudança.

  ## Solução
  Liste as principais soluções implementadas.

  ## Checklist
  - [x] Eu testei localmente as alterações realizadas.
  - [x] Eu adicionei ou atualizei testes que comprovam a eficácia das mudanças.
  - [x] Todos os testes passaram com sucesso.
  - [x] Eu atualizei a documentação, se necessário.
  - [x] Certifique-se de que a Pull Request está em branch separado do branch principal.

  ## Screenshots (se aplicável)

  ## Link para teste
  ---

Nome da branch:
${entry.branchName}

Resumo escrito pelo usuario:
${formatUserSummary(entry.userSummary)}

Configuracao:
- Provedor de IA: ${config.aiProvider}
- Modelo: ${config.modelName}
- Gerar Pull Request: ${config.createPR ? "sim" : "nao"}

Instrucao de Pull Request:
${formatPrInstruction(config)}

Status curto do Git:
\`\`\`txt
${formatBlock(gitStatus, "Nenhum status informado.")}
\`\`\`

Diff staged:
\`\`\`diff
${formatBlock(stagedDiff, "Nenhuma alteracao staged.")}
\`\`\`

Diff tracked unstaged:
\`\`\`diff
${formatBlock(diff, "Nenhuma alteracao tracked unstaged.")}
\`\`\`

Arquivos novos ainda nao rastreados:
\`\`\`txt
${formatBlock(untrackedFiles, "Nenhum arquivo novo nao rastreado.")}
\`\`\`
`.trim();
}
