import type { ChangeRule, PatternType } from '@gate-screener/shared-types';

const changeTimeframeLabels: Record<ChangeRule['timeframe'], string> = {
  '1m': '1 分钟',
  '5m': '5 分钟',
  '1h': '1 小时',
  '4h': '4 小时',
  today: '今日'
};

export const formatPercent = (value: number): string => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(value);

export const buildChangeRuleSummary = (rule: ChangeRule): string => {
  const timeframe = changeTimeframeLabels[rule.timeframe];

  if (rule.operator === 'BETWEEN') {
    return `${timeframe} 涨跌幅 ${rule.min ?? 0}% ~ ${rule.max ?? 0}%`;
  }

  const operator = rule.operator === 'GT' ? '>' : '<';
  return `${timeframe} 涨跌幅 ${operator} ${rule.value ?? 0}%`;
};

export const uniqueNumbers = (values: number[]): number[] => [...new Set(values)].sort((a, b) => a - b);

export const patternSortOrder: PatternType[] = [
  'LONG_UPPER_SHADOW',
  'LONG_LOWER_SHADOW',
  'BULLISH_ENGULFING',
  'BEARISH_ENGULFING',
  'W_BOTTOM',
  'LOTUS_FROM_WATER',
  'GUILLOTINE',
  'ROUND_BOTTOM',
  'FLAG_BREAKOUT',
  'DOUBLE_PIN_BOTTOM',
  'THREE_INCENSE'
];
