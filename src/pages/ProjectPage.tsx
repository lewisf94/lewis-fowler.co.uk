import { useState } from "react";
import type { Project } from "../content/types";
import { projects } from "../content/projects";
import { projectSummary } from "../content/home";
import { LazyModelViewer as ModelViewer } from "../components/LazyModelViewer";
import { Frame } from "../components/Frame";

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectPage({ project: p }: { project: Project }) {
  const [showInside, setShowInside] = useState(false);
  const index = projects.findIndex((x) => x.id === p.id);
  const next = projects[(index + 1) % projects.length];
  const summary = projectSummary[p.id];
  const modelPath = p.model && (showInside && p.model.internalsPath ? p.model.internalsPath : p.model.path);

  return (
    <article className="wrap detail">
      <a className="mono back" href="#work">
        ← All projects
      </a>
      <div className="project-meta">
        <span className="mono">
          {pad(index + 1)} / {pad(projects.length)}
        </span>
        <span className="mono dim">{p.status === "planned" ? "In progress" : "Working build"}</span>
      </div>
      <h1 className="display detail-title">{p.title}</h1>
      <p className="lede">{summary?.plain ?? p.short}</p>

      {modelPath && (
        <Frame className="detail-figure">
          <ModelViewer key={modelPath} path={modelPath} withControls autoRotate={false} display={p.display} />
          <p className="figure-caption">
            <span>Fig. 01</span>
            <span>{showInside ? "Inside" : "Outside"}</span>
            {p.model?.internalsPath && (
              <button type="button" className="link-btn mono" onClick={() => setShowInside((v) => !v)}>
                {showInside ? "Show outside" : "Show inside"}
              </button>
            )}
          </p>
        </Frame>
      )}

      <div className="detail-grid">
        <aside>
          {summary && (
            <div className="detail-stat">
              <span className="display stat-value">{summary.stat.value}</span>
              <span className="mono dim">{summary.stat.label}</span>
            </div>
          )}
          <ul className="chips">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {p.links?.github && (
            <a className="btn btn-line" href={p.links.github} target="_blank" rel="noopener">
              Code on GitHub ↗
            </a>
          )}
        </aside>

        <div className="prose">
          <h2 className="mono-label">The idea</h2>
          <p>{p.intro}</p>
          <h2 className="mono-label">How it works</h2>
          <p>{p.tech}</p>
          {p.math && <pre className="math">{p.math}</pre>}
          {p.diagrams?.map((d) => (
            <figure key={d.path} className="diagram">
              <img src={d.path.startsWith("/") ? d.path : `/${d.path}`} alt={d.label} loading="lazy" />
              <figcaption className="mono dim">{d.label}</figcaption>
            </figure>
          ))}
          <h2 className="mono-label">What was hard</h2>
          <p>{p.challenges}</p>
          {p.results && (
            <>
              <h2 className="mono-label">Where it is now</h2>
              <p>{p.results}</p>
            </>
          )}
        </div>
      </div>

      {p.specs.length > 0 && (
        <Frame className="profile specs">
          <p className="mono-label">Specification</p>
          <dl className="rows">
            {p.specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Frame>
      )}

      <a className="next-project" href={`#work/${next.id}`}>
        <span className="mono dim">Next project</span>
        <span className="display">
          {next.title} <span aria-hidden="true">→</span>
        </span>
      </a>
    </article>
  );
}
