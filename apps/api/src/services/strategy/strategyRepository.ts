import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { StrategyRecord } from '@gate-screener/shared-types';

interface SaveStrategyParams {
  name: string;
  request: StrategyRecord['request'];
}

export class StrategyRepository {
  constructor(private readonly storePath: string) {}

  async list(): Promise<StrategyRecord[]> {
    return this.readAll();
  }

  async getById(id: string): Promise<StrategyRecord | undefined> {
    const strategies = await this.readAll();
    return strategies.find((strategy) => strategy.id === id);
  }

  async save(params: SaveStrategyParams): Promise<StrategyRecord> {
    const strategies = await this.readAll();
    const now = new Date().toISOString();
    const strategy: StrategyRecord = {
      id: randomUUID(),
      name: params.name,
      request: params.request,
      createdAt: now,
      updatedAt: now
    };

    strategies.unshift(strategy);
    await this.writeAll(strategies);
    return strategy;
  }

  async delete(id: string): Promise<boolean> {
    const strategies = await this.readAll();
    const next = strategies.filter((strategy) => strategy.id !== id);
    if (next.length === strategies.length) {
      return false;
    }

    await this.writeAll(next);
    return true;
  }

  private async readAll(): Promise<StrategyRecord[]> {
    await mkdir(path.dirname(this.storePath), { recursive: true });

    try {
      const content = await readFile(this.storePath, 'utf8');
      const parsed = JSON.parse(content) as StrategyRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      const nodeError = error as { code?: string };
      if (nodeError.code === 'ENOENT') {
        await this.writeAll([]);
        return [];
      }

      throw error;
    }
  }

  private async writeAll(strategies: StrategyRecord[]): Promise<void> {
    await mkdir(path.dirname(this.storePath), { recursive: true });
    await writeFile(this.storePath, JSON.stringify(strategies, null, 2), 'utf8');
  }
}
