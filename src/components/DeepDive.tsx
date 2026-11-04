import type { MouseEvent } from "react";
import type { DeepDive as DeepDiveData } from "../content/caseStudyTypes";
import { Blocks, StatusBadge } from "./Blocks";

/**
 * The technical half of a project page: a dated timeline of stages.
 * A stage index at the top lets a reader jump to one part.
 */
export function DeepDive({ data }: { data: DeepDiveData }) {
  return (
    <section className="deep-dive" aria-labelledby="deep-dive-title">
      <header className="part-head">
        <p className="mono-label">Part 2</p>
        <h2 id="deep-dive-title" className="display part-title">
          Engineering deep dive
        </h2>
        <p className="part-intro">{data.intro}</p>
        <div className="status-key mono dim" aria-label="Status key">
          <StatusBadge status="done" />
          <StatusBadge status="current" />
          <StatusBadge status="planned" />
        </div>
      </header>

      <nav className="stage-index" aria-label="Deep dive stages">
        <ol>
          {data.stages.map((s, i) => (
            <li key={s.id}>
              <a href={`#stage-${s.id}`} onClick={(e) => jump(e, s.id)}>
                <span className="mono dim">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.label}</span>
                <span className={`dot ${s.status}`} aria-label={s.status} />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol className="stages">
        {data.stages.map((s, i) => (
          <li key={s.id} id={`stage-${s.id}`} className={`stage ${s.status}`}>
            <div className="stage-marker" aria-hidden="true" />
            <header className="stage-head">
              <p className="mono dim">
                {String(i + 1).padStart(2, "0")} · {s.label}
                {s.when && <> · {s.when}</>}
              </p>
              <h3 className="stage-title">{s.title}</h3>
              <StatusBadge status={s.status} />
            </header>
            <div className="stage-body">
              <Blocks blocks={s.blocks} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The site uses the hash for routes, so stage links scroll instead of changing the URL. */
function jump(e: MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(`stage-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
