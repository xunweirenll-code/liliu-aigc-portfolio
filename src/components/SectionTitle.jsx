export default function SectionTitle({ eyebrow, title, intro }) {
  return (
    <div className="section-title reveal">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}
