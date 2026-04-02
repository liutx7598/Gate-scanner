import type { FastifyInstance } from 'fastify';
import type { ScanController } from '../controllers/scanController.js';

export const registerScanRoutes = async (
  app: FastifyInstance,
  controller: ScanController
): Promise<void> => {
  app.post('/scan', controller.scan);
};
