import type { BiasRule, BollRule, KdjRule, MacdRule, RsiRule, ScanRequest, VolumeRatioRule } from '@gate-screener/shared-types';

interface IndicatorFilterPanelProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
}

const updateRangeRule = <T extends { enabled: boolean; min?: number; max?: number }>(
  current: T,
  patch: Partial<T>
): T => ({
  ...current,
  ...patch
});

const parseNumberInput = (value: string): number | undefined => (value === '' ? undefined : Number(value));

export function IndicatorFilterPanel({ request, onChange }: IndicatorFilterPanelProps) {
  return (
    <section className="card filter-section filter-section--compact">
      <div className="section-heading">
        <div>
          <h2>技术指标</h2>
          <p className="section-copy">补齐旧版项目里的 RSI、MACD、KDJ、BOLL、BIAS 和成交量倍数筛选。</p>
        </div>
      </div>

      <div className="indicator-grid">
        <div className={`indicator-card ${request.rsiRule.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>RSI</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.rsiRule.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    rsiRule: updateRangeRule<RsiRule>(request.rsiRule, { enabled: event.target.checked })
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields">
            <label className="field">
              <span>周期</span>
              <select
                value={request.rsiRule.period}
                onChange={(event) =>
                  onChange({
                    ...request,
                    rsiRule: updateRangeRule<RsiRule>(request.rsiRule, {
                      period: Number(event.target.value) as RsiRule['period']
                    })
                  })
                }
              >
                <option value={6}>RSI6</option>
                <option value={14}>RSI14</option>
                <option value={24}>RSI24</option>
              </select>
            </label>
            <label className="field">
              <span>最小值</span>
              <input
                type="number"
                value={request.rsiRule.min ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    rsiRule: updateRangeRule<RsiRule>(request.rsiRule, { min: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
            <label className="field">
              <span>最大值</span>
              <input
                type="number"
                value={request.rsiRule.max ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    rsiRule: updateRangeRule<RsiRule>(request.rsiRule, { max: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className={`indicator-card ${request.macdRule.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>MACD</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.macdRule.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    macdRule: updateRangeRule<MacdRule>(request.macdRule, { enabled: event.target.checked }),
                    macdSignal: 'ANY'
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields indicator-card__fields--dense">
            <label className="field">
              <span>线</span>
              <select
                value={request.macdRule.line}
                onChange={(event) =>
                  onChange({
                    ...request,
                    macdRule: updateRangeRule<MacdRule>(request.macdRule, {
                      line: event.target.value as MacdRule['line']
                    })
                  })
                }
              >
                <option value="DIF">DIF</option>
                <option value="DEA">DEA</option>
                <option value="HISTOGRAM">Histogram</option>
              </select>
            </label>
            <label className="field">
              <span>交叉</span>
              <select
                value={request.macdRule.cross}
                onChange={(event) =>
                  onChange({
                    ...request,
                    macdRule: updateRangeRule<MacdRule>(request.macdRule, {
                      cross: event.target.value as MacdRule['cross']
                    })
                  })
                }
              >
                <option value="ANY">任意</option>
                <option value="GOLDEN_CROSS">金叉</option>
                <option value="DEAD_CROSS">死叉</option>
              </select>
            </label>
            <label className="field">
              <span>最小值</span>
              <input
                type="number"
                step="0.01"
                value={request.macdRule.min ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    macdRule: updateRangeRule<MacdRule>(request.macdRule, { min: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
            <label className="field">
              <span>最大值</span>
              <input
                type="number"
                step="0.01"
                value={request.macdRule.max ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    macdRule: updateRangeRule<MacdRule>(request.macdRule, { max: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className={`indicator-card ${request.kdjRule.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>KDJ</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.kdjRule.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    kdjRule: updateRangeRule<KdjRule>(request.kdjRule, { enabled: event.target.checked })
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields indicator-card__fields--dense">
            <label className="field">
              <span>线</span>
              <select
                value={request.kdjRule.line}
                onChange={(event) =>
                  onChange({
                    ...request,
                    kdjRule: updateRangeRule<KdjRule>(request.kdjRule, {
                      line: event.target.value as KdjRule['line']
                    })
                  })
                }
              >
                <option value="K">K</option>
                <option value="D">D</option>
                <option value="J">J</option>
              </select>
            </label>
            <label className="field">
              <span>交叉</span>
              <select
                value={request.kdjRule.cross}
                onChange={(event) =>
                  onChange({
                    ...request,
                    kdjRule: updateRangeRule<KdjRule>(request.kdjRule, {
                      cross: event.target.value as KdjRule['cross']
                    })
                  })
                }
              >
                <option value="ANY">任意</option>
                <option value="GOLDEN_CROSS">金叉</option>
                <option value="DEAD_CROSS">死叉</option>
              </select>
            </label>
            <label className="field">
              <span>最小值</span>
              <input
                type="number"
                value={request.kdjRule.min ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    kdjRule: updateRangeRule<KdjRule>(request.kdjRule, { min: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
            <label className="field">
              <span>最大值</span>
              <input
                type="number"
                value={request.kdjRule.max ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    kdjRule: updateRangeRule<KdjRule>(request.kdjRule, { max: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className={`indicator-card ${request.bollRule.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>BOLL</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.bollRule.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    bollRule: updateRangeRule<BollRule>(request.bollRule, { enabled: event.target.checked })
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields indicator-card__fields--dense">
            <label className="field">
              <span>位置</span>
              <select
                value={request.bollRule.position}
                onChange={(event) =>
                  onChange({
                    ...request,
                    bollRule: updateRangeRule<BollRule>(request.bollRule, {
                      position: event.target.value as BollRule['position']
                    })
                  })
                }
              >
                <option value="ANY">任意</option>
                <option value="ABOVE_MID">中轨上方</option>
                <option value="BELOW_MID">中轨下方</option>
                <option value="BREAK_UPPER">上破上轨</option>
                <option value="BREAK_LOWER">下破下轨</option>
              </select>
            </label>
            <label className="field">
              <span>带宽最小 %</span>
              <input
                type="number"
                value={request.bollRule.min ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    bollRule: updateRangeRule<BollRule>(request.bollRule, { min: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
            <label className="field">
              <span>带宽最大 %</span>
              <input
                type="number"
                value={request.bollRule.max ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    bollRule: updateRangeRule<BollRule>(request.bollRule, { max: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className={`indicator-card ${request.biasRule.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>BIAS</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.biasRule.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    biasRule: updateRangeRule<BiasRule>(request.biasRule, { enabled: event.target.checked })
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields">
            <label className="field">
              <span>周期</span>
              <select
                value={request.biasRule.period}
                onChange={(event) =>
                  onChange({
                    ...request,
                    biasRule: updateRangeRule<BiasRule>(request.biasRule, {
                      period: Number(event.target.value) as BiasRule['period']
                    })
                  })
                }
              >
                <option value={5}>BIAS5</option>
                <option value={10}>BIAS10</option>
                <option value={20}>BIAS20</option>
              </select>
            </label>
            <label className="field">
              <span>最小值</span>
              <input
                type="number"
                value={request.biasRule.min ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    biasRule: updateRangeRule<BiasRule>(request.biasRule, { min: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
            <label className="field">
              <span>最大值</span>
              <input
                type="number"
                value={request.biasRule.max ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    biasRule: updateRangeRule<BiasRule>(request.biasRule, { max: parseNumberInput(event.target.value) })
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className={`indicator-card ${request.volumeRatioRule.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>成交量倍数</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.volumeRatioRule.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    volumeRatioRule: updateRangeRule<VolumeRatioRule>(request.volumeRatioRule, {
                      enabled: event.target.checked
                    })
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields">
            <label className="field">
              <span>基准</span>
              <select
                value={request.volumeRatioRule.baseline}
                onChange={(event) =>
                  onChange({
                    ...request,
                    volumeRatioRule: updateRangeRule<VolumeRatioRule>(request.volumeRatioRule, {
                      baseline: event.target.value as VolumeRatioRule['baseline']
                    })
                  })
                }
              >
                <option value="MA5">量均 MA5</option>
                <option value="MA20">量均 MA20</option>
              </select>
            </label>
            <label className="field">
              <span>最小倍数</span>
              <input
                type="number"
                step="0.1"
                value={request.volumeRatioRule.min ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    volumeRatioRule: updateRangeRule<VolumeRatioRule>(request.volumeRatioRule, {
                      min: parseNumberInput(event.target.value)
                    })
                  })
                }
              />
            </label>
            <label className="field">
              <span>最大倍数</span>
              <input
                type="number"
                step="0.1"
                value={request.volumeRatioRule.max ?? ''}
                onChange={(event) =>
                  onChange({
                    ...request,
                    volumeRatioRule: updateRangeRule<VolumeRatioRule>(request.volumeRatioRule, {
                      max: parseNumberInput(event.target.value)
                    })
                  })
                }
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
