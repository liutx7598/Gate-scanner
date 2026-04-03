import { PATTERN_LABELS, type ScanResult } from '@gate-screener/shared-types';
import { formatCompactNumber, formatPercent } from '@gate-screener/shared-utils';

interface ScanResultTableProps {
  scanning: boolean;
  hasScanned: boolean;
  results: ScanResult[];
  selectedContract?: string;
  onSelect: (result: ScanResult) => void;
}

export function ScanResultTable(props: ScanResultTableProps) {
  const { scanning, hasScanned, results, selectedContract, onSelect } = props;

  if (results.length === 0) {
    const title = scanning ? '正在扫描...' : hasScanned ? '本次无命中结果' : '暂无扫描结果';
    const description = scanning
      ? '系统正在拉取市场数据并计算条件，请稍等几秒。'
      : hasScanned
        ? '这次条件比较严格，可以放宽均线、成交量或形态条件后重试。'
        : '设置筛选条件后点击“开始扫描”，结果会显示在这里。';

    return (
      <div className="results-empty">
        <h3>{title}</h3>
        <p>{description}</p>
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
