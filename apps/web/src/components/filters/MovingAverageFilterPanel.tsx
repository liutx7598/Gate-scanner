import type { MaPairRule, MaRule, ScanRequest } from '@gate-screener/shared-types';
import { createMaPairRule, createMaRule } from '@/store/defaults';

interface MovingAverageFilterPanelProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
}

const updateRule = <T,>(items: T[], index: number, patch: Partial<T>): T[] =>
  items.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item));

export function MovingAverageFilterPanel({ request, onChange }: MovingAverageFilterPanelProps) {
  const periods = request.maRules.map((rule) => rule.period);

  return (
    <section className="card filter-section">
      <div className="section-heading section-heading--split">
        <h2>均线筛选</h2>
        <button
          className="ghost-button"
          type="button"
          onClick={() => onChange({ ...request, maRules: [...request.maRules, createMaRule()] })}
        >
          + 添加均线
        </button>
      </div>
      <div className="ma-table">
        {request.maRules.map((rule, index) => (
          <div key={rule.id} className="ma-row">
            <label className="field">
              <span>周期</span>
              <input
                type="number"
                min="1"
                value={rule.period}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maRules: updateRule<MaRule>(request.maRules, index, { period: Number(event.target.value) })
                  })
                }
              />
            </label>
            <label className="field">
              <span>方向</span>
              <select
                value={rule.direction}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maRules: updateRule<MaRule>(request.maRules, index, {
                      direction: event.target.value as MaRule['direction']
                    })
                  })
                }
              >
                <option value="ANY">不限</option>
                <option value="UP">向上</option>
                <option value="DOWN">向下</option>
              </select>
            </label>
            <label className="field">
              <span>斜率</span>
              <select
                value={rule.slopeRange}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maRules: updateRule<MaRule>(request.maRules, index, {
                      slopeRange: event.target.value as MaRule['slopeRange']
                    })
                  })
                }
              >
                <option value="ANY">不限</option>
                <option value="0_45">0-45</option>
                <option value="45_90">45-90</option>
              </select>
            </label>
            <label className="field">
              <span>K线关系</span>
              <select
                value={rule.klineRelation}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maRules: updateRule<MaRule>(request.maRules, index, {
                      klineRelation: event.target.value as MaRule['klineRelation']
                    })
                  })
                }
              >
                <option value="ANY">不限</option>
                <option value="CROSS_UP">向上穿过</option>
                <option value="CROSS_DOWN">向下穿过</option>
                <option value="ABOVE_MA">K线在均线上</option>
                <option value="BELOW_MA">K线在均线下</option>
              </select>
            </label>
            <button
              className="icon-button"
              type="button"
              onClick={() =>
                onChange({
                  ...request,
                  maRules: request.maRules.length === 1 ? request.maRules : request.maRules.filter((item) => item.id !== rule.id)
                })
              }
            >
              删除
            </button>
          </div>
        ))}
      </div>
      <div className="pair-block">
        <div className="pair-title">均线之间关系</div>
        {request.maPairRules.map((rule, index) => (
          <div key={`${rule.maA}-${rule.maB}-${index}`} className="ma-row pair-row">
            <label className="field">
              <span>均线 A</span>
              <select
                value={rule.maA}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maPairRules: updateRule<MaPairRule>(request.maPairRules, index, { maA: Number(event.target.value) })
                  })
                }
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    MA{period}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>均线 B</span>
              <select
                value={rule.maB}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maPairRules: updateRule<MaPairRule>(request.maPairRules, index, { maB: Number(event.target.value) })
                  })
                }
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    MA{period}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>关系</span>
              <select
                value={rule.relation}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maPairRules: updateRule<MaPairRule>(request.maPairRules, index, {
                      relation: event.target.value as MaPairRule['relation']
                    })
                  })
                }
              >
                <option value="ANY">不限</option>
                <option value="CROSS_UP">向上穿过</option>
                <option value="CROSS_DOWN">向下穿过</option>
                <option value="OPPOSITE">相悖</option>
                <option value="CONVERGE">收拢</option>
              </select>
            </label>
            <button
              className="icon-button"
              type="button"
              onClick={() =>
                onChange({
                  ...request,
                  maPairRules:
                    request.maPairRules.length === 1 ? request.maPairRules : request.maPairRules.filter((_, itemIndex) => itemIndex !== index)
                })
              }
            >
              删除
            </button>
          </div>
        ))}
        <button
          className="ghost-button"
          type="button"
          onClick={() => onChange({ ...request, maPairRules: [...request.maPairRules, createMaPairRule()] })}
        >
          + 添加关系
        </button>
      </div>
    </section>
  );
}
