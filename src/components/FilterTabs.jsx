import React from "react";

export default function FilterTabs({ items, active, onChange, language = "zh" }) {
  return (
    <div className="filter-tabs reveal">
      {items.map((item) => (
        <button
          key={item.id}
          className={active === item.id ? "active" : ""}
          type="button"
          onClick={() => onChange(item.id)}
        >
          {language === "en" ? item.enLabel || item.label : item.label}
        </button>
      ))}
    </div>
  );
}
