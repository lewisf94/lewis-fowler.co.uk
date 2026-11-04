import type { MouseEvent } from "react";
import type { Guide } from "../content/caseStudyTypes";
import type { Project } from "../content/types";
import { Blocks } from "../components/Blocks";
import { isDraftPreview } from "../content/guides";

const pad = (n: number) => String(n).padStart(2, "0");

function jump(e: MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(`guide-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** A "Build it yourself" guide. Numbered sections with a contents list. */
export function GuidePage({ guide, project }: { guide: Guide; project: Project }) {
  const missing = guide.sections.filter((s) => s.status === "missing");

  return (
    <article className="wrap detail guide">
      <a className="mono back" href={`#work/${project.id}`}>
        ← {project.title}
      </a>

      {isDraftPreview && !guide.published && (
        <div className="draft-banner" role="note">
          <p className="mono-label">Draft preview. Not on the live site.</p>
          {guide.draftNotes && (
            <ul>
              {guide.draftNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
          {missing.length > 0 && (
            <p className="dim">Sections still to write: {missing.map((s) => s.title).join(", ")}.</p>
          )}
        </div>
      )}

      <div className="project-meta">
        <span className="mono">Build it yourself</span>
        <span className={`mono ${guide.verified ? "" : "dim"}`}>
          {guide.verified ? "Tested build" : "Not yet tested end to end"}
        </span>
      </div>
      <h1 className="display detail-title guide-title">{guide.title}</h1>
      <p className="lede">
        <span className="mono dim">Hardware version</span>
        <br />
        {guide.hardwareVersion}
      </p>

      <div className="guide-layout">
        <nav className="guide-toc" aria-label="Guide sections">
          <p className="mono-label">Contents</p>
          <ol>
            {guide.sections.map((s, i) => (
              <li key={s.id} className={s.status}>
                <a href={`#guide-${s.id}`} onClick={(e) => jump(e, s.id)}>
                  <span className="mono dim">{pad(i + 1)}</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="guide-body">
          {guide.sections.map((s, i) => (
            <section key={s.id} id={`guide-${s.id}`} className="guide-section">
              <h2 className="guide-section-title">
                <span className="mono dim">{pad(i + 1)}</span> {s.title}
              </h2>
              <Blocks blocks={s.blocks} />
              {s.status === "missing" && isDraftPreview && (
                <p className="missing-note mono">Not documented yet. Required before publishing.</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
