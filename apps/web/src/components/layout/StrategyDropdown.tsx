import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import type { StrategyRecord } from '@gate-screener/shared-types';

interface StrategyDropdownProps {
  strategies: StrategyRecord[];
  onLoad: (strategy: StrategyRecord) => void;
  onDelete: (strategy: StrategyRecord) => void;
}

export function StrategyDropdown({ strategies, onLoad, onDelete }: StrategyDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="dropdown dropdown--wide">
      <button
        className="ghost-button dropdown-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="toggle-strategy-dropdown"
      >
        我的筛选策略
        <ChevronDown size={16} />
      </button>

      {open ? (
        <div className="dropdown-panel">
          {strategies.length === 0 ? (
            <div className="dropdown-empty">还没有保存策略，先筛选一组条件再点击“保存策略”。</div>
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
                  <span className="dropdown-time">{new Date(strategy.updatedAt).toLocaleString('zh-CN')}</span>
                </button>

                <button
                  className="icon-button"
                  type="button"
                  onClick={() => onDelete(strategy)}
                  aria-label={`delete-strategy-${strategy.id}`}
                >
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
