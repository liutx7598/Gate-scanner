import type { PatternType, ScanRequest } from '@gate-screener/shared-types';
import { PATTERN_OPTIONS } from '@/store/defaults';

interface PatternFilterPanelProps {
  request: ScanRequest;
  onChange: (next: ScanRequest) => void;
}

export function PatternFilterPanel({ request, onChange }: PatternFilterPanelProps) {
  const togglePattern = (pattern: PatternType) => {
    const exists = request.patterns.includes(pattern);
    const patterns = exists ? request.patterns.filter((item) => item !== pattern) : [...request.patterns, pattern];
    onChange({ ...request, patterns });
  };

  return (
    <section className="card filter-section filter-section--compact">
      <div className="section-heading">
        <div>
          <h2>形态筛选</h2>
          <p className="section-copy">命中任一所选形态即可保留，适合和均线或涨跌幅一起组合筛选。</p>
        </div>
      </div>

      <div className="pattern-grid">
        {PATTERN_OPTIONS.map((pattern) => (
          <label key={pattern.value} className={`pattern-chip ${request.patterns.includes(pattern.value) ? 'active' : ''}`}>
            <input
              aria-label={pattern.value}
              type="checkbox"
              checked={request.patterns.includes(pattern.value)}
              onChange={() => togglePattern(pattern.value)}
            />
            <span>{pattern.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
