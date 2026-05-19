import { init } from "./commands/init.js";
import logger from "./logger.js";

export async function router(args) {
    const command = args[0] || "";
    logger.info("Roteando a aplicação");

    switch (command) {
        case "init":
            await init();
            break;
        default:
            logger.error("Comando não encontrado");
            break;
    }
}

process.env.NOME