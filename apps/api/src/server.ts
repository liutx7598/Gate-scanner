import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { MetaController } from './controllers/metaController.js';
import { ScanController } from './controllers/scanController.js';
import { StrategyController } from './controllers/strategyController.js';
import { registerMetaRoutes } from './routes/metaRoutes.js';
import { registerScanRoutes } from './routes/scanRoutes.js';
import { registerStrategyRoutes } from './routes/strategyRoutes.js';
import { GateMarketService } from './services/gate/gateMarketService.js';
import { ScanEngine } from './services/scanner/scanEngine.js';
import { StrategyRepository } from './services/strategy/strategyRepository.js';
import type { MarketDataService } from './types/internal.js';
import { DEFAULT_STRATEGY_FILE } from './utils/constants.js';
import { AppError } from './utils/errors.js';

interface BuildServerOptions {
  marketDataService?: MarketDataService;
  strategyRepository?: StrategyRepository;
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),
  STRATEGY_STORE_PATH: z.string().default(DEFAULT_STRATEGY_FILE)
});

const dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(dirname, '..');

export const buildServer = async (options: BuildServerOptions = {}) => {
  const env = envSchema.parse(process.env);
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true
  });

  const marketDataService = options.marketDataService ?? new GateMarketService();
  const strategyRepository =
    options.strategyRepository ??
    new StrategyRepository(path.resolve(apiRoot, env.STRATEGY_STORE_PATH));
  const scanEngine = new ScanEngine(marketDataService, app.log);

  const metaController = new MetaController(marketDataService);
  const scanController = new ScanController(scanEngine);
  const strategyController = new StrategyController(strategyRepository);

  app.get('/health', async () => ({ ok: true }));

  await app.register(
    async (api) => {
      await registerMetaRoutes(api, metaController);
      await registerScanRoutes(api, scanController);
      await registerStrategyRoutes(api, strategyController);
    },
    { prefix: '/api' }
  );

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
      return;
    }

    app.log.error(error);
    reply.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务内部错误'
      }
    });
  });

  return { app, env };
};

const start = async (): Promise<void> => {
  const { app, env } = await buildServer();
  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  void start();
}
