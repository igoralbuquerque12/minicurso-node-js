import chalk from "chalk";

const logger = {
  success(message) {
    console.log(chalk.green(`✔ ${message}`));
  },

  error(message, error) {
    console.error(chalk.red(`✖ ${message}`));
    if (error) {
      console.error(chalk.red(error.stack || error.message || String(error)));
    }
  },

  warn(message) {
    console.warn(chalk.yellow(`⚠ ${message}`));
  },

  info(message) {
    console.log(chalk.cyan(`ℹ ${message}`));
  },
};

export default logger;
