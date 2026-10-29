import { profile, skills, education } from "../content/profile";
import { projects } from "../content/projects";
import { experience } from "../content/experience";
import { hero, profileRows, projectSummary, contact } from "../content/home";
import type { SkillCategory } from "../content/types";
import { LazyModelViewer as ModelViewer } from "../components/LazyModelViewer";
import { Frame, SectionLabel } from "../components/Frame";

const SECTIONS = 4;
const pad = (n: number) => String(n).padStart(2, "0");

export function Home() {
  const lead = projects[0];
  return (
    <>
      <section className="hero wrap">
        <div className="hero-text">
          <p className="status-line">
            <span className="status-dot" aria-hidden="true" /> {hero.status}
          </p>
          <h1 className="display hero-title">
            {hero.heading.map((line, i) => (
              <span key={line} className={i === 0 ? "dim" : undefined}>
                {line}
              </span>
            ))}
          </h1>
          <p className="lede">{hero.bio}</p>
          <div className="actions">
            <a className="btn btn-solid" href="#work">
              See projects
            </a>
            <a className="btn btn-line" href="#contact">
              Get in touch <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        {lead.model && (
          <Frame className="hero-figure">
            <ModelViewer
              path={lead.model.path}
              revealPath={lead.model.internalsPath ?? null}
              display={{ ...lead.display, cardViewerH: null }}
              className="hero-viewer"
            />
            <p className="figure-caption">
              <span>Fig. 01</span>
              <span>{lead.title}</span>
              <span className="hide-sm">Hover to see inside</span>
            </p>
          </Frame>
        )}
      </section>

      <section className="wrap band">
        <Frame className="profile">
          <p className="mono-label">Profile</p>
          <dl className="rows">
            {profileRows.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </Frame>
      </section>

      <section id="work" className="wrap section">
        <SectionLabel index={1} total={SECTIONS}>
          Work
        </SectionLabel>
        <h2 className="display section-title">Projects</h2>
        <ol className="project-list">
          {projects.map((p, i) => {
            const s = projectSummary[p.id];
            return (
              <li key={p.id} className="project-row">
                <div className="project-meta">
                  <span className="mono">
                    {pad(i + 1)} / {pad(projects.length)}
                  </span>
                  <span className="mono dim">{p.statusLabel ?? (p.status === "planned" ? "In progress" : "Working build")}</span>
                </div>
                <a className="project-body" href={`#work/${p.id}`}>
                  <div className="project-text">
                    <h3 className="display project-title">{p.title}</h3>
                    <p>{s?.plain ?? p.short}</p>
                    <span className="read-more">
                      Read the build <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="experience" className="wrap section">
        <SectionLabel index={2} total={SECTIONS}>
          Experience
        </SectionLabel>
        <h2 className="display section-title">Where I have worked</h2>
        <ol className="timeline">
          {experience.map((e, i) => (
            <li key={e.slug}>
              <p className="mono dim">
                #{i + 1} · {e.date}
              </p>
              <h3 className="display timeline-title">
                <a href={`#experience/${e.slug}`}>{e.title}</a>
              </h3>
              <p className="mono">{e.place}</p>
              <p className="timeline-text">{e.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mono dim">{education}</p>
      </section>

      <section id="skills" className="wrap section">
        <SectionLabel index={3} total={SECTIONS}>
          Toolkit
        </SectionLabel>
        <h2 className="display section-title">What I use</h2>
        <div className="skill-groups">
          {(["Design", "Analysis", "Making", "Code"] as SkillCategory[]).map((cat, i) => (
            <Frame key={cat} className="skill-group">
              <p className="skill-head">
                <span className="mono">{cat}</span>
                <span className="mono dim">{pad(i + 1)}</span>
              </p>
              <ul className="chips">
                {skills
                  .filter((s) => s.cat === cat)
                  .map((s) => (
                    <li key={s.name}>{s.name}</li>
                  ))}
              </ul>
            </Frame>
          ))}
        </div>
      </section>

      <section id="contact" className="wrap section">
        <SectionLabel index={4} total={SECTIONS}>
          Contact
        </SectionLabel>
        <h2 className="display section-title">{contact.heading}</h2>
        <p className="lede">{contact.text}</p>
        <a className="display contact-email" href={`mailto:${profile.email}`}>
          {profile.email} <span aria-hidden="true">↗</span>
        </a>
        <div className="actions">
          <a className="btn btn-line" href={profile.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a className="btn btn-line" href={profile.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
