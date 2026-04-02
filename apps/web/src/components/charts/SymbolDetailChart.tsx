import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { ScanResult } from '@gate-screener/shared-types';
import { formatPercent } from '@gate-screener/shared-utils';

interface SymbolDetailChartProps {
  result?: ScanResult;
}

const buildOption = (result: ScanResult): EChartsOption => {
  const xAxisData = result.candles.map((candle) =>
    new Date(candle.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  );

  const klineData = result.candles.map((candle) => [candle.open, candle.close, candle.low, candle.high]);
  const maKeys = Object.keys(result.maSeries)
    .filter((key) => ['MA5', 'MA10', 'MA20'].includes(key) || result.hits.some((hit) => hit.includes(key)))
    .filter((key) => Array.isArray(result.maSeries[key]))
    .slice(0, 6);

  return {
    animation: false,
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 0,
      textStyle: { fontSize: 11 }
    },
    grid: {
      left: 12,
      right: 12,
      top: 40,
      bottom: 18,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      boundaryGap: true
    },
    yAxis: {
      scale: true,
      splitLine: { lineStyle: { color: '#e5e7eb' } }
    },
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        data: klineData,
        itemStyle: {
          color: '#ef4444',
          color0: '#10b981',
          borderColor: '#ef4444',
          borderColor0: '#10b981'
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 26,
          data: result.annotations
            .map((annotation) => {
              const index = result.candles.findIndex((candle) => candle.timestamp === annotation.timestamp);
              const axisLabel = xAxisData[index];
              if (index < 0 || axisLabel === undefined) {
                return null;
              }

              return {
                name: annotation.label,
                value: annotation.label,
                coord: [axisLabel, annotation.price] as [string, number]
              };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
        }
      },
      ...maKeys.map((key, index) => ({
        name: key,
        type: 'line' as const,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1.5
        },
        data: (result.maSeries[key] ?? []).map((value) => (Number.isFinite(value) ? value : null)),
        color: ['#2563eb', '#f59e0b', '#8b5cf6', '#0f766e', '#dc2626', '#64748b'][index]
      }))
    ]
  };
};

export function SymbolDetailChart({ result }: SymbolDetailChartProps) {
  if (!result) {
    return (
      <div className="detail-empty">
        <h3>图表详情</h3>
        <p>点击左侧任一标的，查看 K 线、均线和命中说明。</p>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div>
          <h3>{result.contract}</h3>
          <div className="detail-metrics">
            <span>最新价 {result.latestPrice.toFixed(4)}</span>
            <span className={result.changePct >= 0 ? 'positive' : 'negative'}>{formatPercent(result.changePct)}</span>
            <span>波动率 {result.volatility.toFixed(2)}%</span>
          </div>
        </div>
        <div className="detail-hits">
          {result.hits.map((hit, index) => (
            <span key={`${hit}-${index}`} className="tag-pill subtle">
              {hit}
            </span>
          ))}
        </div>
      </div>
      <ReactECharts option={buildOption(result)} style={{ height: 420 }} />
    </div>
  );
}
