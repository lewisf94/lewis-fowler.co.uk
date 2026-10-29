import type { Experience } from "../content/types";

export function ExperiencePage({ item: e }: { item: Experience }) {
  return (
    <article className="wrap detail">
      <a className="mono back" href="#experience">
        ← Experience
      </a>
      <p className="mono dim">{e.date}</p>
      <h1 className="display detail-title">{e.title}</h1>
      <p className="mono">{e.place}</p>
      <div className="prose narrow">
        <p>{e.detail || e.desc}</p>
        <h2 className="mono-label">Highlights</h2>
        <ul>
          {e.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <ul className="chips">
        {e.focus.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
