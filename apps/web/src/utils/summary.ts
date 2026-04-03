import type {
  ChangeRule,
  KLineRelation,
  MaPairRelation,
  PatternType,
  ScanRequest
} from '@gate-screener/shared-types';
import { PATTERN_LABELS } from '@gate-screener/shared-types';
import { buildChangeRuleSummary } from '@gate-screener/shared-utils';
import { createDefaultRequest } from '@/store/defaults';

export interface SelectedConditionTag {
  id: string;
  label: string;
  remove: (request: ScanRequest) => ScanRequest;
}

const defaultRequest = createDefaultRequest();

const sortLabels: Record<NonNullable<ScanRequest['sortBy']>, string> = {
  change: '涨跌幅',
  volume: '成交量',
  volatility: '波动率',
  funding: '资金费率'
};

const maRelationLabels: Record<KLineRelation, string> = {
  ANY: '不限',
  CROSS_UP: '上穿',
  CROSS_DOWN: '下穿',
  ABOVE_MA: 'K 线在均线上',
  BELOW_MA: 'K 线在均线下'
};

const maPairRelationLabels: Record<MaPairRelation, string> = {
  ANY: '不限',
  CROSS_UP: '金叉',
  CROSS_DOWN: '死叉',
  OPPOSITE: '方向相反',
  CONVERGE: '收敛'
};

const isSameChangeRule = (left: ChangeRule, right: ChangeRule): boolean =>
  left.timeframe === right.timeframe &&
  left.operator === right.operator &&
  left.value === right.value &&
  left.min === right.min &&
  left.max === right.max;

const isSamePattern = (left: PatternType, right: PatternType): boolean => left === right;

export const buildSelectedConditionTags = (request: ScanRequest): SelectedConditionTag[] => {
  const tags: SelectedConditionTag[] = [];

  if (request.timeframe !== defaultRequest.timeframe) {
    tags.push({
      id: 'timeframe',
      label: `K 线周期 ${request.timeframe}`,
      remove: (current) => ({ ...current, timeframe: defaultRequest.timeframe })
    });
  }

  if (typeof request.minVolume === 'number') {
    tags.push({
      id: 'min-volume',
      label: `成交量 >= ${request.minVolume}`,
      remove: (current) => ({ ...current, minVolume: undefined })
    });
  }

  if (typeof request.minTurnover === 'number') {
    tags.push({
      id: 'min-turnover',
      label: `成交额 >= ${request.minTurnover}`,
      remove: (current) => ({ ...current, minTurnover: undefined })
    });
  }

  if (request.limit !== defaultRequest.limit) {
    tags.push({
      id: 'limit',
      label: `返回 ${request.limit ?? defaultRequest.limit}`,
      remove: (current) => ({ ...current, limit: defaultRequest.limit })
    });
  }

  if (request.sortBy !== defaultRequest.sortBy || request.sortDirection !== defaultRequest.sortDirection) {
    const sortBy = request.sortBy ?? defaultRequest.sortBy ?? 'volume';
    const sortDirection = request.sortDirection ?? defaultRequest.sortDirection ?? 'desc';
    tags.push({
      id: 'sort',
      label: `${sortLabels[sortBy]} ${sortDirection === 'desc' ? '降序' : '升序'}`,
      remove: (current) => ({
        ...current,
        sortBy: defaultRequest.sortBy,
        sortDirection: defaultRequest.sortDirection
      })
    });
  }

  request.maRules.forEach((rule, index) => {
    const defaultRule = defaultRequest.maRules[index];
    const isDefaultRule =
      defaultRule !== undefined &&
      defaultRule.period === rule.period &&
      defaultRule.direction === rule.direction &&
      defaultRule.slopeRange === rule.slopeRange &&
      defaultRule.klineRelation === rule.klineRelation;

    if (isDefaultRule) {
      return;
    }

    const parts = [`MA${rule.period}`];
    if (rule.direction !== 'ANY') {
      parts.push(rule.direction === 'UP' ? '向上' : '向下');
    }
    if (rule.slopeRange !== 'ANY') {
      parts.push(rule.slopeRange === '0_45' ? '斜率平缓' : '斜率陡峭');
    }
    if (rule.klineRelation !== 'ANY') {
      parts.push(maRelationLabels[rule.klineRelation]);
    }

    tags.push({
      id: `ma-rule-${rule.id}`,
      label: parts.join(' · '),
      remove: (current) => ({
        ...current,
        maRules: current.maRules.filter((item) => item.id !== rule.id),
        maPairRules: current.maPairRules.filter((pair) => pair.maA !== rule.period && pair.maB !== rule.period)
      })
    });
  });

  request.maPairRules.forEach((rule, index) => {
    const defaultRule = defaultRequest.maPairRules[index];
    const isDefaultRule =
      defaultRule !== undefined &&
      defaultRule.maA === rule.maA &&
      defaultRule.maB === rule.maB &&
      defaultRule.relation === rule.relation;

    if (isDefaultRule || rule.relation === 'ANY') {
      return;
    }

    tags.push({
      id: `ma-pair-${index}`,
      label: `MA${rule.maA} / MA${rule.maB} · ${maPairRelationLabels[rule.relation]}`,
      remove: (current) => ({
        ...current,
        maPairRules: current.maPairRules.filter((_, currentIndex) => currentIndex !== index)
      })
    });
  });

  if (request.maConvergence.enabled) {
    tags.push({
      id: 'ma-convergence',
      label: `均线收敛 <= ${request.maConvergence.thresholdPct}%`,
      remove: (current) => ({
        ...current,
        maConvergence: {
          ...current.maConvergence,
          enabled: false
        }
      })
    });
  }

  if (request.entityCrossAboveMa5) {
    tags.push({
      id: 'entity-cross-above-ma5',
      label: '实体上穿 MA5',
      remove: (current) => ({
        ...current,
        entityCrossAboveMa5: false
      })
    });
  }

  request.changeRules.forEach((rule, index) => {
    const defaultRule = defaultRequest.changeRules[index];
    if (defaultRule !== undefined && isSameChangeRule(defaultRule, rule)) {
      return;
    }

    tags.push({
      id: `change-rule-${index}`,
      label: buildChangeRuleSummary(rule),
      remove: (current) => ({
        ...current,
        changeRules: current.changeRules.filter((_, currentIndex) => currentIndex !== index)
      })
    });
  });

  if (request.rsiRule.enabled) {
    tags.push({
      id: 'rsi-rule',
      label: `RSI${request.rsiRule.period}`,
      remove: (current) => ({
        ...current,
        rsiRule: {
          ...current.rsiRule,
          enabled: false
        }
      })
    });
  }

  if (request.macdRule.enabled || request.macdSignal !== defaultRequest.macdSignal) {
    const macdCross = request.macdRule.enabled ? request.macdRule.cross : request.macdSignal;
    tags.push({
      id: 'macd-rule',
      label: macdCross === 'DEAD_CROSS' ? 'MACD 死叉' : macdCross === 'GOLDEN_CROSS' ? 'MACD 金叉' : 'MACD',
      remove: (current) => ({
        ...current,
        macdSignal: defaultRequest.macdSignal,
        macdRule: {
          ...current.macdRule,
          enabled: false,
          cross: defaultRequest.macdRule.cross,
          min: undefined,
          max: undefined
        }
      })
    });
  }

  if (request.kdjRule.enabled) {
    tags.push({
      id: 'kdj-rule',
      label: `KDJ ${request.kdjRule.line}`,
      remove: (current) => ({
        ...current,
        kdjRule: {
          ...current.kdjRule,
          enabled: false
        }
      })
    });
  }

  if (request.bollRule.enabled) {
    tags.push({
      id: 'boll-rule',
      label: 'BOLL',
      remove: (current) => ({
        ...current,
        bollRule: {
          ...current.bollRule,
          enabled: false
        }
      })
    });
  }

  if (request.biasRule.enabled) {
    tags.push({
      id: 'bias-rule',
      label: `BIAS${request.biasRule.period}`,
      remove: (current) => ({
        ...current,
        biasRule: {
          ...current.biasRule,
          enabled: false
        }
      })
    });
  }

  if (request.volumeRatioRule.enabled) {
    tags.push({
      id: 'volume-ratio-rule',
      label: `量比 ${request.volumeRatioRule.baseline}`,
      remove: (current) => ({
        ...current,
        volumeRatioRule: {
          ...current.volumeRatioRule,
          enabled: false
        }
      })
    });
  }

  request.patterns.forEach((pattern) => {
    const isDefaultPattern = defaultRequest.patterns.some((item) => isSamePattern(item, pattern));
    if (isDefaultPattern) {
      return;
    }

    tags.push({
      id: `pattern-${pattern}`,
      label: PATTERN_LABELS[pattern],
      remove: (current) => ({
        ...current,
        patterns: current.patterns.filter((item) => item !== pattern)
      })
    });
  });

  return tags;
};
