import type { Block, BomItem, WorkStatus } from "../content/caseStudyTypes";
import { Gallery } from "./Gallery";
import { OutArrow } from "./OutArrow";

const STATUS_TEXT: Record<WorkStatus, string> = {
  done: "Done",
  current: "In progress",
  planned: "Planned",
};

export function StatusBadge({ status }: { status: WorkStatus }) {
  return <span className={`status-badge ${status}`}>{STATUS_TEXT[status]}</span>;
}

/** Blank lines start a new paragraph. */
function Text({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </>
  );
}

function Heading({ text }: { text?: string }) {
  return text ? <h4 className="block-heading mono-label">{text}</h4> : null;
}

const isExternal = (href: string) => /^https?:/.test(href);

function bomCsv(items: BomItem[]): string {
  const cell = (v: string | number | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Part", "Part number", "Quantity", "Purpose", "Supplier", "Supplier link", "Alternatives"];
  const rows = items.map((b) =>
    [b.part, b.partNumber, b.qty, b.purpose, b.supplier?.label, b.supplier?.href, b.alternatives].map(cell).join(","),
  );
  return [head.map(cell).join(","), ...rows].join("\r\n");
}

function downloadCsv(name: string, text: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "text":
      return (
        <div className="block block-text">
          <Heading text={block.heading} />
          <Text text={block.text} />
        </div>
      );

    case "list":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <ul className="block-list">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case "steps":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <ol className="block-steps">
            {block.items.map((step, i) => (
              <li key={i}>
                <p>{step.text}</p>
                {step.images && <Gallery images={step.images} />}
              </li>
            ))}
          </ol>
        </div>
      );

    case "decisions":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <div className="cards">
            {block.items.map((d) => (
              <div key={d.choice} className="card">
                <p className="card-title">{d.choice}</p>
                <p className="card-body">{d.reason}</p>
                {d.alternatives && (
                  <p className="card-note">
                    <span className="mono dim">Considered</span> {d.alternatives}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "problems":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <dl className="problems">
            {block.items.map((p) => (
              <div key={p.problem}>
                <dt>
                  <span className="mono dim">Problem</span>
                  {p.problem}
                </dt>
                <dd>
                  <span className="mono dim">Response</span>
                  {p.fix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "checklist":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <ul className="checklist">
            {block.items.map((item) => (
              <li key={item.text} className={item.status}>
                <StatusBadge status={item.status} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "table":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="block">
          <Gallery images={block.images} />
        </div>
      );

    case "warning":
      return (
        <div className="block warning" role="note">
          <p className="mono-label">{block.heading}</p>
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case "bom": {
      const hasSupplier = block.items.some((b) => b.supplier);
      const hasAlt = block.items.some((b) => b.alternatives);
      return (
        <div className="block">
          <Heading text={block.heading} />
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Part number</th>
                  <th>Qty</th>
                  <th>Purpose</th>
                  {hasSupplier && <th>Supplier</th>}
                  {hasAlt && <th>Alternatives</th>}
                </tr>
              </thead>
              <tbody>
                {block.items.map((b) => (
                  <tr key={b.part}>
                    <td>{b.part}</td>
                    <td className="mono">{b.partNumber ?? ""}</td>
                    <td>{b.qty}</td>
                    <td>{b.purpose ?? ""}</td>
                    {hasSupplier && (
                      <td>
                        {b.supplier && (
                          <a href={b.supplier.href} target="_blank" rel="noopener">
                            {b.supplier.label} <OutArrow />
                          </a>
                        )}
                      </td>
                    )}
                    {hasAlt && <td>{b.alternatives ?? ""}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-line block-action"
            onClick={() => downloadCsv(block.csvName, bomCsv(block.items))}
          >
            Download parts list (CSV)
          </button>
        </div>
      );
    }

    case "downloads":
      return (
        <div className="block">
          <Heading text={block.heading} />
          <ul className="downloads">
            {block.files.map((f) => (
              <li key={f.href}>
                <a
                  href={f.href}
                  {...(isExternal(f.href) ? { target: "_blank", rel: "noopener" } : { download: "" })}
                >
                  {f.label} {isExternal(f.href) && <OutArrow />}
                </a>
                {f.version && <span className="mono dim">{f.version}</span>}
                {f.note && <span className="dim">{f.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      );

    case "code":
      return <pre className="block code-block">{block.text}</pre>;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  );
}
