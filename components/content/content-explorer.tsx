"use client";

import { useId, useState, type ReactNode } from "react";

type Entry = { id: string; search: string; content: ReactNode };

export function ContentExplorer({ entries, label, grid = false }: { entries: Entry[]; label: string; grid?: boolean }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = entries.filter(entry => terms.every(term => entry.search.toLocaleLowerCase().includes(term)));
  return (
    <div className="content-explorer">
      <div className="explorer-toolbar">
        <label htmlFor={id} className="explorer-search"><span aria-hidden="true">⌕</span><span className="sr-only">{label}</span><input id={id} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={label} /></label>
        {query ? <button className="explorer-clear" type="button" onClick={() => setQuery("")}>清除</button> : null}
        <span className="explorer-count" role="status">{visible.length} / {entries.length}</span>
      </div>
      <div className={grid ? "two-col explorer-results" : "explorer-results"}>
        {visible.map(entry => <div className="explorer-entry" key={entry.id}>{entry.content}</div>)}
      </div>
      {!visible.length ? <div className="explorer-empty"><p>没有找到匹配内容，换个关键词试试。</p><button type="button" onClick={() => setQuery("")}>显示全部</button></div> : null}
    </div>
  );
}
