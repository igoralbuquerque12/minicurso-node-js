# TODO - Explicação: Acoplamento usando `init` e `logger`

## Ideia principal

Acoplamento é quando uma parte do código depende diretamente de outra.

Neste exemplo, temos uma função `init` que faz o setup de um projeto.

Durante esse setup, ela precisa mostrar mensagens no terminal, como:

- sucesso
- erro
- aviso
- informação

---

## Exemplo com alto acoplamento

```js
import chalk from "chalk";

async function init() {
  console.log(chalk.cyan("ℹ Iniciando projeto..."));
  console.log(chalk.green("✔ Pasta criada com sucesso"));
  console.warn(chalk.yellow("⚠ Arquivo já existe"));
  console.error(chalk.red("✖ Erro ao criar projeto"));
}
```

Qual o problema?

Aqui a função `init` está fazendo duas coisas:

- cuidando da lógica de setup do projeto
- cuidando da forma como os logs aparecem no terminal

Ou seja, `init` depende diretamente do `chalk`.

Isso gera acoplamento.

## Problemas desse acoplamento

Se amanhã você quiser:

- trocar `chalk` por outra biblioteca
- remover cores do terminal
- mudar os ícones das mensagens
- salvar logs em arquivo
- padronizar logs em todo o projeto

você vai precisar mexer dentro da função `init`.

Isso não é ideal.

## Melhor solução: criar um logger

Em vez da função `init` chamar `chalk` diretamente, criamos um arquivo responsável apenas pelos logs.

```js
import chalk from "chalk";

const logger = {
  success(message) {
    console.log(chalk.green(`✔ ${message}`));
  },

  error(message) {
    console.error(chalk.red(`✖ ${message}`));
  },

  warn(message) {
    console.warn(chalk.yellow(`⚠ ${message}`));
  },

  info(message) {
    console.log(chalk.cyan(`ℹ ${message}`));
  },
};

export default logger;
```

## Agora o `init` usa o logger

```js
import logger from "./logger.js";

async function init() {
  logger.info("Iniciando projeto...");
  logger.success("Pasta criada com sucesso");
  logger.warn("Arquivo já existe");
  logger.error("Erro ao criar projeto");
}
```

## O que melhorou?

Agora a função `init` não sabe mais que existe `chalk`.

Ela só sabe que existe um logger com métodos como:

- `logger.info()`
- `logger.success()`
- `logger.warn()`
- `logger.error()`

Isso deixa o código mais desacoplado.

## Antes

`init` -> `chalk`

A função `init` dependia diretamente do `chalk`.

## Depois

`init` -> `logger` -> `chalk`

Agora quem conhece o `chalk` é apenas o logger.

Se quiser trocar a biblioteca de cores, você altera só o logger.

## Benefícios

- o `init` fica mais limpo
- o código fica mais fácil de manter
- os logs ficam padronizados
- trocar o `chalk` depois fica simples
- a responsabilidade fica no lugar certo

## Resumo

Antes, o `init` estava acoplado ao `chalk`.

Depois, o `init` passou a depender apenas do logger.

Isso é desacoplamento: esconder detalhes de implementação dentro de um módulo específico, deixando o resto do código mais simples e flexível.