#!/usr/bin/env node

import { router } from '../src/router.js';
import logger from '../src/logger.js';

logger.info("Iniciando a aplicação");

router(process.argv.slice(2));

