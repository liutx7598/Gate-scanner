import type { FastifyInstance } from 'fastify';
import type { StrategyController } from '../controllers/strategyController.js';

export const registerStrategyRoutes = async (
  app: FastifyInstance,
  controller: StrategyController
): Promise<void> => {
  app.get('/strategies', controller.list);
  app.get('/strategies/:id', controller.getById);
  app.post('/strategies', controller.save);
  app.delete('/strategies/:id', controller.delete);
};
