import logger from "../logger.js";

// avisar que o init foi chamado
// criar um diretorio pras entradas
// criar um diretorio pras saidas
// criar a configuração padrao do usuario
// adicionar no gitignore o arquivo de entrada e saida
// criar um exemplo de entrada
// adicionar na .env a chave da IA

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
}