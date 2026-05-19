#!/usr/bin/env node

import 'dotenv/config';
import { router } from '../src/router.js';
import logger from '../src/logger.js';

router(process.argv.slice(2));
