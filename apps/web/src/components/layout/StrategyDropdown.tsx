import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import type { StrategyRecord } from '@gate-screener/shared-types';

interface StrategyDropdownProps {
  strategies: StrategyRecord[];
  onLoad: (strategy: StrategyRecord) => void;
  onDelete: (strategy: StrategyRecord) => void;
}

export function StrategyDropdown({ strategies, onLoad, onDelete }: StrategyDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <button className="ghost-button dropdown-trigger" type="button" onClick={() => setOpen((value) => !value)}>
        我的策略
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="dropdown-panel">
          {strategies.length === 0 ? (
            <div className="dropdown-empty">暂无已保存策略</div>
          ) : (
            strategies.map((strategy) => (
              <div key={strategy.id} className="dropdown-item">
                <button
                  className="dropdown-load"
                  type="button"
                  onClick={() => {
                    onLoad(strategy);
                    setOpen(false);
                  }}
                >
                  <span>{strategy.name}</span>
                  <span className="dropdown-time">{new Date(strategy.updatedAt).toLocaleDateString('zh-CN')}</span>
                </button>
                <button className="icon-button" type="button" onClick={() => onDelete(strategy)} aria-label="删除策略">
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
