import type { SelectedConditionTag } from '@/utils/summary';

interface SelectedConditionTagsProps {
  tags: SelectedConditionTag[];
  onRemove: (tag: SelectedConditionTag) => void;
}

export function SelectedConditionTags({ tags, onRemove }: SelectedConditionTagsProps) {
  if (tags.length === 0) {
    return <div className="tag-strip empty">已选条件会显示在这里，点击右侧 x 可快速移除。</div>;
  }

  return (
    <div className="tag-strip" aria-label="已选条件">
      {tags.map((tag) => (
        <button
          key={tag.id}
          className="tag-pill tag-pill--action"
          type="button"
          onClick={() => onRemove(tag)}
          title={`移除 ${tag.label}`}
        >
          <span>{tag.label}</span>
          <span className="tag-pill__close" aria-hidden="true">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
