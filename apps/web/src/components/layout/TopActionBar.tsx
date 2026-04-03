import { Play, RefreshCw, Save } from 'lucide-react';
import type { StrategyRecord } from '@gate-screener/shared-types';
import type { SelectedConditionTag } from '@/utils/summary';
import { SelectedConditionTags } from './SelectedConditionTags';
import { StrategyDropdown } from './StrategyDropdown';

interface TopActionBarProps {
  tags: SelectedConditionTag[];
  scanning: boolean;
  strategies: StrategyRecord[];
  onScan: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoadStrategy: (strategy: StrategyRecord) => void;
  onDeleteStrategy: (strategy: StrategyRecord) => void;
  onRemoveTag: (tag: SelectedConditionTag) => void;
}

export function TopActionBar(props: TopActionBarProps) {
  const {
    tags,
    scanning,
    strategies,
    onDeleteStrategy,
    onLoadStrategy,
    onRemoveTag,
    onReset,
    onSave,
    onScan
  } = props;

  return (
    <header className="control-header card">
      <div className="control-header__top">
        <div className="top-bar__title">
          <span className="eyebrow">Gate Futures Screener</span>
          <h1>Gate 合约市场筛选器</h1>
          <p className="toolbar-copy">紧凑模式下把筛选集中放在顶部，方便同屏调整和对照结果。</p>
        </div>

        <div className="top-bar__actions">
          <button className="primary-button" type="button" onClick={onScan} disabled={scanning}>
            <Play size={14} />
            {scanning ? '扫描中' : '开始扫描'}
          </button>
          <button className="ghost-button" type="button" onClick={onReset}>
            <RefreshCw size={14} />
            重置条件
          </button>
          <button className="ghost-button" type="button" onClick={onSave}>
            <Save size={14} />
            保存策略
          </button>
        </div>
      </div>

      <div className="control-meta-grid">
        <div className="control-row control-row--selected">
          <div className="control-row__label">
            <span>已选条件</span>
            <small>点右侧 x 可直接删除</small>
          </div>
          <SelectedConditionTags tags={tags} onRemove={onRemoveTag} />
        </div>

        <div className="control-row">
          <div className="control-row__label">
            <span>我的策略</span>
            <small>可快速加载或删除</small>
          </div>
          <StrategyDropdown strategies={strategies} onLoad={onLoadStrategy} onDelete={onDeleteStrategy} />
        </div>
      </div>
    </header>
  );
}
