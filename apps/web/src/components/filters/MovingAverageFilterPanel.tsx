import { uniqueNumbers } from '@gate-screener/shared-utils';
import type { MaPairRule, MaRule, ScanRequest } from '@gate-screener/shared-types';
import { createMaPairRule, createMaRule } from '@/store/defaults';

interface MovingAverageFilterPanelProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
  onApplyCommonPreset?: () => void;
}

const updateRule = <T,>(items: T[], index: number, patch: Partial<T>): T[] =>
  items.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item));

const getSelectedPeriods = (maRules: MaRule[]) => uniqueNumbers(maRules.map((rule) => rule.period));

const syncPairRules = (maRules: MaRule[], maPairRules: MaPairRule[]): MaPairRule[] => {
  const periods = new Set(maRules.map((rule) => rule.period));
  return maPairRules.filter((rule) => periods.has(rule.maA) && periods.has(rule.maB) && rule.maA !== rule.maB);
};

export function MovingAverageFilterPanel({
  request,
  onChange,
  onApplyCommonPreset
}: MovingAverageFilterPanelProps) {
  const periods = getSelectedPeriods(request.maRules);

  const updateMaRules = (nextMaRules: MaRule[], nextMaPairRules = request.maPairRules) => {
    onChange({
      ...request,
      maRules: nextMaRules,
      maPairRules: syncPairRules(nextMaRules, nextMaPairRules),
      maConvergence: {
        ...request.maConvergence,
        periods: getSelectedPeriods(nextMaRules)
      }
    });
  };

  const handleAddRule = () => {
    updateMaRules([...request.maRules, createMaRule()]);
  };

  const handleRemoveRule = (rule: MaRule) => {
    const nextMaRules = request.maRules.filter((item) => item.id !== rule.id);
    updateMaRules(nextMaRules);
  };

  const handleUpdatePeriod = (index: number, nextPeriod: number) => {
    const currentRule = request.maRules[index];
    if (!currentRule || Number.isNaN(nextPeriod) || nextPeriod <= 0) {
      return;
    }

    const nextMaRules = updateRule<MaRule>(request.maRules, index, { period: nextPeriod });
    const nextMaPairRules = request.maPairRules.map((rule) => ({
      ...rule,
      maA: rule.maA === currentRule.period ? nextPeriod : rule.maA,
      maB: rule.maB === currentRule.period ? nextPeriod : rule.maB
    }));

    updateMaRules(nextMaRules, nextMaPairRules);
  };

  return (
    <section className="card filter-section filter-section--compact">
      <div className="section-heading section-heading--split">
        <div>
          <h2>均线条件</h2>
          <p className="section-copy">设置均线方向、斜率、K 线关系，以及旧版常用的均线收敛与实体上穿条件。</p>
        </div>

        {onApplyCommonPreset ? (
          <button className="ghost-button ghost-button--compact" type="button" onClick={onApplyCommonPreset}>
            一键常用条件
          </button>
        ) : null}
      </div>

      <div className="inline-selector">
        <div className="inline-selector__label">均线级别</div>
        <div className="ma-token-list">
          {request.maRules.map((rule, index) => (
            <div key={rule.id} className="ma-token">
              <span className="ma-token__index">均线 {index + 1}</span>
              <span className="ma-token__prefix">MA</span>
              <input
                aria-label={`ma-period-${index}`}
                type="number"
                min="1"
                value={rule.period}
                onChange={(event) => handleUpdatePeriod(index, Number(event.target.value))}
              />
              <button
                className="icon-button icon-button--quiet"
                type="button"
                onClick={() => handleRemoveRule(rule)}
                aria-label={`remove-ma-rule-${index}`}
              >
                ×
              </button>
            </div>
          ))}

          <button className="ghost-button ghost-button--compact" type="button" onClick={handleAddRule} aria-label="add-ma-rule">
            + 新增均线
          </button>
        </div>
      </div>

      {request.maRules.length === 0 ? <div className="placeholder-line">还没有均线条件，请先新增一条均线。</div> : null}

      <div className="rule-stack">
        {request.maRules.map((rule, index) => (
          <div key={rule.id} className="rule-card">
            <div className="rule-card__title">
              <strong>均线 {index + 1}</strong>
              <span>MA{rule.period}</span>
            </div>

            <div className="rule-card__grid">
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
                  <option value="ANY">任意</option>
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
                  <option value="ANY">任意</option>
                  <option value="0_45">平缓</option>
                  <option value="45_90">陡峭</option>
                </select>
              </label>

              <label className="field">
                <span>K 线关系</span>
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
                  <option value="ANY">任意</option>
                  <option value="CROSS_UP">向上穿过</option>
                  <option value="CROSS_DOWN">向下穿过</option>
                  <option value="ABOVE_MA">K 线在均线上</option>
                  <option value="BELOW_MA">K 线在均线下</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="section-heading section-heading--split section-heading--tight">
        <div>
          <h3 className="section-subtitle">均线相对关系</h3>
          <p className="section-copy">用于判断两条均线是否交叉、相反或收敛。</p>
        </div>
        <button
          className="ghost-button ghost-button--compact"
          type="button"
          onClick={() => onChange({ ...request, maPairRules: [...request.maPairRules, createMaPairRule()] })}
        >
          + 新增关系
        </button>
      </div>

      {periods.length < 2 ? <div className="placeholder-line">至少保留两条不同周期的均线，才可以设置均线相对关系。</div> : null}

      {periods.length >= 2 ? (
        <div className="rule-stack rule-stack--pairs">
          {request.maPairRules.map((rule, index) => (
            <div key={`${rule.maA}-${rule.maB}-${index}`} className="rule-card rule-card--pair">
              <div className="rule-card__grid rule-card__grid--pair">
                <label className="field">
                  <span>均线 A</span>
                  <select
                    value={rule.maA}
                    onChange={(event) =>
                      onChange({
                        ...request,
                        maPairRules: updateRule<MaPairRule>(request.maPairRules, index, {
                          maA: Number(event.target.value)
                        })
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
                        maPairRules: updateRule<MaPairRule>(request.maPairRules, index, {
                          maB: Number(event.target.value)
                        })
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
                    <option value="ANY">任意</option>
                    <option value="CROSS_UP">向上穿过</option>
                    <option value="CROSS_DOWN">向下穿过</option>
                    <option value="OPPOSITE">方向相反</option>
                    <option value="CONVERGE">均线收敛</option>
                  </select>
                </label>

                <button
                  className="icon-button icon-button--quiet icon-button--align-end"
                  type="button"
                  onClick={() =>
                    onChange({
                      ...request,
                      maPairRules: request.maPairRules.filter((_, currentIndex) => currentIndex !== index)
                    })
                  }
                  aria-label={`remove-ma-pair-${index}`}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="indicator-grid indicator-grid--supplement">
        <div className={`indicator-card ${request.maConvergence.enabled ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>均线收敛</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.maConvergence.enabled}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maConvergence: {
                      ...request.maConvergence,
                      enabled: event.target.checked,
                      periods
                    }
                  })
                }
              />
              <span>启用</span>
            </label>
          </div>
          <div className="indicator-card__fields">
            <label className="field">
              <span>阈值 %</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={request.maConvergence.thresholdPct}
                onChange={(event) =>
                  onChange({
                    ...request,
                    maConvergence: {
                      ...request.maConvergence,
                      thresholdPct: Number(event.target.value),
                      periods
                    }
                  })
                }
              />
            </label>
          </div>
          <p className="indicator-card__note">自动按当前已选均线级别计算收敛程度。</p>
        </div>

        <div className={`indicator-card ${request.entityCrossAboveMa5 ? 'indicator-card--active' : ''}`}>
          <div className="indicator-card__head">
            <strong>实体上穿 MA5</strong>
            <label className="indicator-switch">
              <input
                type="checkbox"
                checked={request.entityCrossAboveMa5}
                onChange={(event) => onChange({ ...request, entityCrossAboveMa5: event.target.checked })}
              />
              <span>启用</span>
            </label>
          </div>
          <p className="indicator-card__note">要求最近一根收盘 K 线为阳线，且实体从下向上穿过 MA5。</p>
        </div>
      </div>
    </section>
  );
}
