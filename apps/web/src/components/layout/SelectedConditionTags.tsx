interface SelectedConditionTagsProps {
  tags: string[];
}

export function SelectedConditionTags({ tags }: SelectedConditionTagsProps) {
  if (tags.length === 0) {
    return <div className="tag-strip empty">尚未选择筛选条件</div>;
  }

  return (
    <div className="tag-strip" aria-label="已选条件摘要">
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className="tag-pill">
          {tag}
        </span>
      ))}
    </div>
  );
}
