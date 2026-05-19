import { init } from "./commands/init.js";
import { run } from "./commands/run.js";
import logger from "./logger.js";

export async function router(args) {
    const command = args[0] || "";
    logger.info("Roteando a aplicação");

    switch (command) {
        case "init":
            await init();
            break;
        case "run":
            await run();
            break;
        default:
            logger.error("Comando não encontrado");
            break;
    }
}
