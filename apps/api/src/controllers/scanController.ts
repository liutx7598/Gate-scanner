import type { FastifyReply, FastifyRequest } from 'fastify';
import { scanRequestSchema } from '../schemas/scanSchemas.js';
import type { ScanEngine } from '../services/scanner/scanEngine.js';
import { AppError } from '../utils/errors.js';

export class ScanController {
  constructor(private readonly scanEngine: ScanEngine) {}

  scan = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const parsed = scanRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', '扫描参数不合法', 400, parsed.error.flatten());
    }

    const result = await this.scanEngine.scan(parsed.data);
    reply.send(result);
  };
}
