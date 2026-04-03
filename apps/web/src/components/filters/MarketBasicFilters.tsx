import type { ScanRequest } from '@gate-screener/shared-types';
import { buildSortPreset, MARKET_OPTIONS, parseSortPreset, SORT_OPTIONS, TIMEFRAME_LABELS } from '@/store/defaults';

interface MarketBasicFiltersProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
}

export function MarketBasicFilters({ request, onChange }: MarketBasicFiltersProps) {
  return (
    <section className="card filter-section filter-section--compact">
      <div className="section-heading">
        <div>
          <h2>基础条件</h2>
          <p className="section-copy">先选 K 线周期，再补充成交量、成交额、排序方式和返回数量。</p>
        </div>
      </div>

      <div className="inline-selector">
        <div className="inline-selector__label">K 线周期</div>
        <div className="segment-group">
          {TIMEFRAME_LABELS.map((option) => (
            <button
              key={option}
              className={`segment-button ${request.timeframe === option ? 'active' : ''}`}
              type="button"
              onClick={() => onChange({ ...request, timeframe: option })}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="compact-grid compact-grid--5">
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
          <span>最小成交额</span>
          <input
            type="number"
            min="0"
            placeholder="例如 5000000"
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
