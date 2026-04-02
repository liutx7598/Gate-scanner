import type { FastifyReply, FastifyRequest } from 'fastify';
import type { MarketDataService } from '../types/internal.js';

export class MetaController {
  constructor(private readonly marketDataService: MarketDataService) {}

  getContracts = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const contracts = await this.marketDataService.getContracts('usdt');
    reply.send({ data: contracts });
  };
}
