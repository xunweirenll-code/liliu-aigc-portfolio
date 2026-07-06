import React from "react";

export default function ProcessStep({ number, title, text }) {
  return (
    <article className="process-step reveal">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
