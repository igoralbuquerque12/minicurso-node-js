import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

import logger from "../logger.js";

function runCommand(command) {
  return execSync(command, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "ignore"]
  });
}

/**
 * Pega as alterações feitas em arquivos que o Git já conhece,
 * mas que ainda NÃO foram adicionadas na área de stage.
 *
 * Em outras palavras:
 * mostra o que foi alterado antes do `git add`.
 *
 * Equivalente ao comando:
 * git diff
 *
 * @returns {string} Texto com as diferenças encontradas ou string vazia em caso de erro.
 */
function getGitDiff() {
  try {
    return runCommand("git diff");
  } catch {
    return "";
  }
}

/**
 * Pega as alterações que já foram adicionadas na área de stage.
 *
 * Em outras palavras:
 * mostra o que já passou pelo `git add`,
 * mas ainda NÃO foi commitado.
 *
 * Equivalente ao comando:
 * git diff --staged
 *
 * @returns {string} Texto com as diferenças staged ou string vazia em caso de erro.
 */
function getStagedGitDiff() {
  try {
    return runCommand("git diff --staged");
  } catch {
    return "";
  }
}

/**
 * Pega um resumo curto do estado atual do repositório.
 *
 * Mostra arquivos:
 * - modificados
 * - adicionados ao stage
 * - removidos
 * - novos ainda não rastreados
 *
 * Equivalente ao comando:
 * git status --short
 *
 * @returns {string} Status resumido do Git ou string vazia em caso de erro.
 */
function getGitStatus() {
  try {
    return runCommand("git status --short");
  } catch {
    return "";
  }
}

/**
 * Pega a lista de arquivos novos que ainda não foram adicionados ao Git.
 *
 * Em outras palavras:
 * mostra arquivos que existem na pasta,
 * mas que o Git ainda não está rastreando.
 *
 * Equivalente ao comando:
 * git ls-files --others --exclude-standard
 *
 * @returns {string} Lista de arquivos não rastreados ou string vazia em caso de erro.
 */
function getUntrackedFiles() {
  try {
    return runCommand("git ls-files --others --exclude-standard");
  } catch {
    return "";
  }
}
async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

function createSafeFileName(branchName) {
  return branchName.replaceAll("/", "-");
}


