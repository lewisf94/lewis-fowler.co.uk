import { OutArrow } from "../components/OutArrow";
import { useState } from "react";
import type { Project } from "../content/types";
import { projects } from "../content/projects";
import { projectSummary } from "../content/home";
import { LazyModelViewer as ModelViewer } from "../components/LazyModelViewer";
import { Frame } from "../components/Frame";
import { DeepDive } from "../components/DeepDive";
import { deepDives } from "../content/deepDives";
import { guidesFor, isDraftPreview } from "../content/guides";

/** Blank lines start a new paragraph. A paragraph that starts with "$ " is a formula. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((para, i) =>
        para.startsWith("$ ") ? (
          <pre key={i} className="math">
            {para.slice(2)}
          </pre>
        ) : (
          <p key={i}>{para}</p>
        ),
      )}
    </>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectPage({ project: p }: { project: Project }) {
  const [showInside, setShowInside] = useState(false);
  const index = projects.findIndex((x) => x.id === p.id);
  const next = projects[(index + 1) % projects.length];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const summary = projectSummary[p.id];
  const deepDive = deepDives[p.id];
  const projectGuides = guidesFor(p.id);
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
        <span className="mono dim">{p.statusLabel ?? (p.status === "planned" ? "In progress" : "In Development")}</span>
      </div>
      <h1 className="display detail-title">{p.title}</h1>
      {deepDive && (
        <p className="part-jump mono">
          <span className="dim">Part 1 · Project overview</span>
          <a href="#deep-dive-title" onClick={(e) => {
            e.preventDefault();
            document.getElementById("deep-dive-title")?.scrollIntoView({ behavior: "smooth" });
          }}>
            Part 2 · {deepDive.title ?? "Engineering deep dive"} ↓
          </a>
        </p>
      )}
      <p className="lede">{p.lede ?? summary?.plain ?? p.short}</p>

      {modelPath && (
        <Frame className="detail-figure">
          <ModelViewer
            key={modelPath}
            path={modelPath}
            revealPath={showInside ? null : (p.model?.internalsPath ?? null)}
            withControls
            autoRotate={false}
            display={p.display}
          />
          <p className="figure-caption">
            <span>{showInside ? "Inside" : "Outside"}</span>
            {!showInside && p.model?.internalsPath && <span className="hide-sm">Hover to look inside</span>}
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
          <ul className="chips">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {p.links?.github && (
            <a className="btn btn-line" href={p.links.github} target="_blank" rel="noopener">
              Code on GitHub <OutArrow />
            </a>
          )}
          {projectGuides.map((g) => (
            <a key={g.id} className="btn btn-solid" href={`#build/${g.id}`}>
              Build it yourself{projectGuides.length > 1 ? `: ${g.hardwareVersion.split(":")[0]}` : ""}
              {isDraftPreview && !g.published ? " (draft)" : ""}
            </a>
          ))}
          {p.links?.demo && (
            <a className="btn btn-line" href={p.links.demo} target="_blank" rel="noopener">
              Open the live site <OutArrow />
            </a>
          )}
        </aside>

        <div className="prose">
          <h2 className="mono-label">The idea</h2>
          <Paragraphs text={p.intro} />
          <h2 className="mono-label">How it works</h2>
          <Paragraphs text={p.tech} />
          {p.math && <pre className="math">{p.math}</pre>}
          {p.diagrams?.map((d) => (
            <figure key={d.path} className="diagram">
              <img src={d.path.startsWith("/") ? d.path : `/${d.path}`} alt={d.label} loading="lazy" />
              <figcaption className="mono dim">{d.label}</figcaption>
            </figure>
          ))}
          <h2 className="mono-label">What was hard</h2>
          <Paragraphs text={p.challenges} />
          {p.results && (
            <>
              <h2 className="mono-label">Where it is now</h2>
              <Paragraphs text={p.results} />
            </>
          )}
        </div>
      </div>

      {p.specGroups ? (
        <Frame className="profile specs">
          <p className="mono-label">Specification</p>
          <div className="spec-groups">
            {p.specGroups.map((g) => (
              <div key={g.heading}>
                <h3 className="mono-label">{g.heading}</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Frame>
      ) : p.specs.length > 0 && (
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

      {deepDive && <DeepDive data={deepDive} />}

      <nav className="project-nav" aria-label="More projects">
        <a className="project-nav-link prev" href={`#work/${prev.id}`}>
          <span className="mono dim">Previous project</span>
          <span className="display">
            <span aria-hidden="true">←</span> {prev.title}
          </span>
        </a>
        <a className="project-nav-link next" href={`#work/${next.id}`}>
          <span className="mono dim">Next project</span>
          <span className="display">
            {next.title} <span aria-hidden="true">→</span>
          </span>
        </a>
      </nav>
    </article>
  );
}
