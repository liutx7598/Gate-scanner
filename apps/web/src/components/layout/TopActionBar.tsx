import { Play, RefreshCw, Save } from 'lucide-react';
import type { StrategyRecord } from '@gate-screener/shared-types';
import { SelectedConditionTags } from './SelectedConditionTags';
import { StrategyDropdown } from './StrategyDropdown';

interface TopActionBarProps {
  tags: string[];
  scanning: boolean;
  strategies: StrategyRecord[];
  onScan: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoadStrategy: (strategy: StrategyRecord) => void;
  onDeleteStrategy: (strategy: StrategyRecord) => void;
}

export function TopActionBar(props: TopActionBarProps) {
  const { tags, scanning, strategies, onDeleteStrategy, onLoadStrategy, onReset, onSave, onScan } = props;

  return (
    <header className="top-bar card">
      <div className="top-bar__title">
        <span className="eyebrow">Gate Futures</span>
        <h1>Gate 合约全市场筛选器</h1>
      </div>
      <SelectedConditionTags tags={tags} />
      <div className="top-bar__actions">
        <button className="primary-button" type="button" onClick={onScan} disabled={scanning}>
          <Play size={16} />
          {scanning ? '扫描中…' : '开始扫描'}
        </button>
        <button className="ghost-button" type="button" onClick={onReset}>
          <RefreshCw size={16} />
          重置条件
        </button>
        <button className="ghost-button" type="button" onClick={onSave}>
          <Save size={16} />
          保存策略
        </button>
        <StrategyDropdown strategies={strategies} onLoad={onLoadStrategy} onDelete={onDeleteStrategy} />
      </div>
    </header>
  );
}
