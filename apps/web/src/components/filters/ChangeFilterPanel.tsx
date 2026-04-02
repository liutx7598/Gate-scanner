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
    <section className="card filter-section">
      <div className="section-heading section-heading--split">
        <h2>涨跌幅筛选</h2>
        <button
          className="ghost-button"
          type="button"
          onClick={() => onChange({ ...request, changeRules: [...request.changeRules, createChangeRule()] })}
        >
          + 添加涨跌幅
        </button>
      </div>
      {request.changeRules.length === 0 ? <div className="placeholder-line">未设置涨跌幅条件</div> : null}
      {request.changeRules.map((rule, index) => (
        <div key={`${rule.timeframe}-${index}`} className="ma-row">
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
              <option value="1m">1分钟</option>
              <option value="5m">5分钟</option>
              <option value="1h">1小时</option>
              <option value="4h">4小时</option>
              <option value="today">今日</option>
            </select>
          </label>
          <label className="field">
            <span>运算符</span>
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
            className="icon-button"
            type="button"
            onClick={() =>
              onChange({
                ...request,
                changeRules: request.changeRules.filter((_, itemIndex) => itemIndex !== index)
              })
            }
          >
            删除
          </button>
        </div>
      ))}
    </section>
  );
}
