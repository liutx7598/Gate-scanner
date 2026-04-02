import { PATTERN_LABELS, type ScanResult } from '@gate-screener/shared-types';
import { formatCompactNumber, formatPercent } from '@gate-screener/shared-utils';

interface ScanResultTableProps {
  results: ScanResult[];
  selectedContract?: string;
  onSelect: (result: ScanResult) => void;
}

export function ScanResultTable({ results, selectedContract, onSelect }: ScanResultTableProps) {
  if (results.length === 0) {
    return (
      <div className="results-empty">
        <h3>暂无扫描结果</h3>
        <p>设置筛选条件后点击“开始扫描”，结果会在这里展示。</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="result-table">
        <thead>
          <tr>
            <th>合约</th>
            <th>最新价</th>
            <th>涨跌幅</th>
            <th>成交量</th>
            <th>资金费率</th>
            <th>命中条件</th>
            <th>命中形态</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.contract}
              className={result.contract === selectedContract ? 'active' : ''}
              onClick={() => onSelect(result)}
            >
              <td>{result.contract}</td>
              <td>{result.latestPrice.toFixed(4)}</td>
              <td className={result.changePct >= 0 ? 'positive' : 'negative'}>{formatPercent(result.changePct)}</td>
              <td>{formatCompactNumber(result.turnover || result.volume)}</td>
              <td>{result.fundingRate === undefined ? '--' : formatPercent(result.fundingRate * 100)}</td>
              <td>{result.hits.slice(0, 3).join(' / ')}</td>
              <td>{result.hitPatterns.length > 0 ? result.hitPatterns.map((pattern) => PATTERN_LABELS[pattern]).join(', ') : '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
