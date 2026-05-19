import fs from "fs/promises";
import path from "path";

import logger from "../logger.js";

const CONFIG_FILE = "vibe-git.config.json";

const DEFAULT_CONFIG = {
  aiProvider: "gemini",
  modelName: "gemini-2.5-flash",
  createPR: true,
  prTemplate: "# Summary\nExplain what changed.\n\n# Testing\nExplain how this was tested."
};

const DEFAULT_ENTRY = {
  branchName: "feature-auth",
  userSummary: [
    "Criei a tela de login",
    "Adicionei validação de formulário",
    "Ajustei a chamada para a API de autenticação"
  ]
};

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeJson(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, "utf-8");
}

async function addLinesToFile(filePath, lines) {
  let currentContent = "";

  if (await fileExists(filePath)) {
    currentContent = await fs.readFile(filePath, "utf-8");
  }

  const currentLines = currentContent.split("\n");

  const linesToAdd = lines.filter(line => {
    return !currentLines.includes(line);
  });

  if (linesToAdd.length === 0) {
    return;
  }

  const prefix = currentContent.endsWith("\n") || currentContent.length === 0
    ? ""
    : "\n";

  await fs.appendFile(filePath, prefix + linesToAdd.join("\n") + "\n");
}

export async function init() {
  logger.info("Iniciando a aplicação");

  await fs.mkdir("vibe-git/entry", { recursive: true });
  await fs.mkdir("vibe-git/exit", { recursive: true });

  await writeJson(CONFIG_FILE, DEFAULT_CONFIG);

  const entryPath = path.join("vibe-git", "entry", "example.json");
  await writeJson(entryPath, DEFAULT_ENTRY);

  await addLinesToFile(".env", [
    "VIBE_GIT_AI_API_KEY=",
    "GEMINI_API_KEY=",
    "OPENAI_API_KEY=",
    "GROQ_API_KEY="
  ]);

  await addLinesToFile(".gitignore", [
    "vibe-git/",
    ".env"
  ]);

  logger.success("Configuração inicial criada com sucesso");
}