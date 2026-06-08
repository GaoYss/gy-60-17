export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
