import type { ScanRequest } from '@gate-screener/shared-types';
import { buildSortPreset, MARKET_OPTIONS, parseSortPreset, SORT_OPTIONS, TIMEFRAME_LABELS } from '@/store/defaults';

interface MarketBasicFiltersProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
}

export function MarketBasicFilters({ request, onChange }: MarketBasicFiltersProps) {
  return (
    <section className="card filter-section">
      <div className="section-heading">
        <h2>基础市场筛选</h2>
      </div>
      <div className="compact-grid compact-grid--6">
        <label className="field">
          <span>交易市场</span>
          <select value={request.settle} onChange={() => onChange({ ...request, settle: 'usdt' })}>
            {MARKET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} disabled={!option.enabled}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>K 线周期</span>
          <select
            value={request.timeframe}
            onChange={(event) => onChange({ ...request, timeframe: event.target.value as ScanRequest['timeframe'] })}
          >
            {TIMEFRAME_LABELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>最小成交额</span>
          <input
            type="number"
            min="0"
            placeholder="例如 1000000"
            value={request.minTurnover ?? ''}
            onChange={(event) =>
              onChange({
                ...request,
                minTurnover: event.target.value === '' ? undefined : Number(event.target.value)
              })
            }
          />
        </label>
        <label className="field">
          <span>最小成交量</span>
          <input
            type="number"
            min="0"
            placeholder="例如 500000"
            value={request.minVolume ?? ''}
            onChange={(event) =>
              onChange({
                ...request,
                minVolume: event.target.value === '' ? undefined : Number(event.target.value)
              })
            }
          />
        </label>
        <label className="field">
          <span>排序方式</span>
          <select
            value={buildSortPreset(request)}
            onChange={(event) => onChange({ ...request, ...parseSortPreset(event.target.value) })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>返回数量</span>
          <select
            value={request.limit ?? 50}
            onChange={(event) => onChange({ ...request, limit: Number(event.target.value) })}
          >
            {[20, 50, 100, 200].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
