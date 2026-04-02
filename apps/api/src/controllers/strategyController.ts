import type { FastifyReply, FastifyRequest } from 'fastify';
import { saveStrategySchema } from '../schemas/scanSchemas.js';
import type { StrategyRepository } from '../services/strategy/strategyRepository.js';
import { AppError } from '../utils/errors.js';

export class StrategyController {
  constructor(private readonly strategyRepository: StrategyRepository) {}

  list = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const strategies = await this.strategyRepository.list();
    reply.send({ data: strategies });
  };

  getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> => {
    const strategy = await this.strategyRepository.getById(request.params.id);
    if (!strategy) {
      throw new AppError('NOT_FOUND', '策略不存在', 404);
    }

    reply.send({ data: strategy });
  };

  save = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const parsed = saveStrategySchema.safeParse(request.body);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', '策略参数不合法', 400, parsed.error.flatten());
    }

    const strategy = await this.strategyRepository.save(parsed.data);
    reply.status(201).send({ data: strategy });
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> => {
    const deleted = await this.strategyRepository.delete(request.params.id);
    if (!deleted) {
      throw new AppError('NOT_FOUND', '策略不存在', 404);
    }

    reply.status(204).send();
  };
}
