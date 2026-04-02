import { PATTERN_LABELS, type ScanRequest } from '@gate-screener/shared-types';
import { buildChangeRuleSummary } from '@gate-screener/shared-utils';

export const buildSelectedConditionTags = (request: ScanRequest): string[] => {
  const tags: string[] = [`市场 ${request.settle.toUpperCase()}`, `周期 ${request.timeframe}`];

  if (request.minVolume) {
    tags.push(`成交量 >= ${request.minVolume}`);
  }

  if (request.minTurnover) {
    tags.push(`成交额 >= ${request.minTurnover}`);
  }

  if (request.limit) {
    tags.push(`返回 ${request.limit}`);
  }

  if (request.sortBy) {
    tags.push(`排序 ${request.sortBy}/${request.sortDirection ?? 'desc'}`);
  }

  request.maRules
    .filter((rule) => rule.direction !== 'ANY' || rule.slopeRange !== 'ANY' || rule.klineRelation !== 'ANY')
    .forEach((rule) => {
      tags.push(`MA${rule.period}`);
      if (rule.direction !== 'ANY') {
        tags.push(`MA${rule.period} ${rule.direction === 'UP' ? '向上' : '向下'}`);
      }
      if (rule.slopeRange !== 'ANY') {
        tags.push(`MA${rule.period} 斜率 ${rule.slopeRange}`);
      }
      if (rule.klineRelation !== 'ANY') {
        tags.push(`MA${rule.period} ${rule.klineRelation}`);
      }
    });

  request.maPairRules
    .filter((rule) => rule.relation !== 'ANY')
    .forEach((rule) => tags.push(`MA${rule.maA}/MA${rule.maB} ${rule.relation}`));

  request.changeRules.forEach((rule) => tags.push(buildChangeRuleSummary(rule)));
  request.patterns.forEach((pattern) => tags.push(PATTERN_LABELS[pattern]));

  return tags;
};
