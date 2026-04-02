import type { FastifyInstance } from 'fastify';
import type { MetaController } from '../controllers/metaController.js';

export const registerMetaRoutes = async (
  app: FastifyInstance,
  controller: MetaController
): Promise<void> => {
  app.get('/meta/contracts', controller.getContracts);
};
