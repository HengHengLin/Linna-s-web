import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { pageFor, routeUrl, statusLabel } from '../routes';
export default function Cards({ entries, empty = '暂无符合条件的内容。' }) {
  if (!entries.length) return <div className="empty-panel"><p>{empty}</p></div>;
  return <div className="entry-grid">{entries.map(x => <a key={x.id} className="entry" href={routeUrl(pageFor(x.kind), x.id)}>
    <div className="entry-top"><span className="eyebrow">{x.category} · {statusLabel(x)}</span><ArrowUpRight size={17}/></div>
    <h3>{x.title}</h3><p>{x.summary}</p><div className="entry-bottom"><span>{x.date}</span><span>{x.reading || x.duration || '阅读全文'}</span></div>
  </a>)}</div>;
}
