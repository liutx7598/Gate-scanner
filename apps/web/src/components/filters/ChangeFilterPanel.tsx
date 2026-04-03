import type { ChangeRule, ScanRequest } from '@gate-screener/shared-types';
import { createChangeRule } from '@/store/defaults';

interface ChangeFilterPanelProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
}

const updateRule = (items: ChangeRule[], index: number, patch: Partial<ChangeRule>): ChangeRule[] =>
  items.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item));

export function ChangeFilterPanel({ request, onChange }: ChangeFilterPanelProps) {
  return (
    <section className="card filter-section filter-section--compact">
      <div className="section-heading section-heading--split section-heading--tight">
        <div>
          <h2>涨跌幅</h2>
          <p className="section-copy">先选时间段，再输入大于、小于或区间百分比。</p>
        </div>
        <button
          className="ghost-button ghost-button--compact"
          type="button"
          onClick={() => onChange({ ...request, changeRules: [...request.changeRules, createChangeRule()] })}
        >
          + 新增涨跌幅
        </button>
      </div>

      {request.changeRules.length === 0 ? <div className="placeholder-line">还没有涨跌幅条件。</div> : null}

      <div className="rule-stack">
        {request.changeRules.map((rule, index) => (
          <div key={`${rule.timeframe}-${index}`} className="rule-card rule-card--pair">
            <div className="rule-card__grid rule-card__grid--change">
              <label className="field">
                <span>时间段</span>
                <select
                  value={rule.timeframe}
                  onChange={(event) =>
                    onChange({
                      ...request,
                      changeRules: updateRule(request.changeRules, index, {
                        timeframe: event.target.value as ChangeRule['timeframe']
                      })
                    })
                  }
                >
                  <option value="1m">1 分钟</option>
                  <option value="5m">5 分钟</option>
                  <option value="1h">1 小时</option>
                  <option value="4h">4 小时</option>
                  <option value="today">今日</option>
                </select>
              </label>

              <label className="field">
                <span>条件</span>
                <select
                  value={rule.operator}
                  onChange={(event) =>
                    onChange({
                      ...request,
                      changeRules: updateRule(request.changeRules, index, {
                        operator: event.target.value as ChangeRule['operator']
                      })
                    })
                  }
                >
                  <option value="GT">大于</option>
                  <option value="LT">小于</option>
                  <option value="BETWEEN">区间</option>
                </select>
              </label>

              {rule.operator === 'BETWEEN' ? (
                <>
                  <label className="field">
                    <span>最小值 %</span>
                    <input
                      type="number"
                      value={rule.min ?? ''}
                      onChange={(event) =>
                        onChange({
                          ...request,
                          changeRules: updateRule(request.changeRules, index, {
                            min: event.target.value === '' ? undefined : Number(event.target.value)
                          })
                        })
                      }
                    />
                  </label>

                  <label className="field">
                    <span>最大值 %</span>
                    <input
                      type="number"
                      value={rule.max ?? ''}
                      onChange={(event) =>
                        onChange({
                          ...request,
                          changeRules: updateRule(request.changeRules, index, {
                            max: event.target.value === '' ? undefined : Number(event.target.value)
                          })
                        })
                      }
                    />
                  </label>
                </>
              ) : (
                <label className="field">
                  <span>百分比 %</span>
                  <input
                    type="number"
                    value={rule.value ?? ''}
                    onChange={(event) =>
                      onChange({
                        ...request,
                        changeRules: updateRule(request.changeRules, index, {
                          value: event.target.value === '' ? undefined : Number(event.target.value)
                        })
                      })
                    }
                  />
                </label>
              )}

              <button
                className="icon-button icon-button--quiet icon-button--align-end"
                type="button"
                onClick={() =>
                  onChange({
                    ...request,
                    changeRules: request.changeRules.filter((_, currentIndex) => currentIndex !== index)
                  })
                }
                aria-label={`remove-change-rule-${index}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
