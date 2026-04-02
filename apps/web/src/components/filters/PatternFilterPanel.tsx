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
    <section className="card filter-section">
      <div className="section-heading">
        <h2>形态选股</h2>
      </div>
      <div className="pattern-grid">
        {PATTERN_OPTIONS.map((pattern) => (
          <label key={pattern.value} className={`pattern-chip ${request.patterns.includes(pattern.value) ? 'active' : ''}`}>
            <input
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
