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
        {(e.detail || e.desc).split("\n\n").map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <ul className="chips">
        {e.focus.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
