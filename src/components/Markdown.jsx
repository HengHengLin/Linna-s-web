import React from 'react';
import Diagram from './Diagram';
import {parseDiagram} from '../diagrams';

// Intentionally small Markdown subset: text, headings, lists, quotes and HTTPS links.
// Raw HTML and arbitrary executable content are never interpreted.
function inline(text) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    let safe = false;
    try { const url = new URL(match[2]); safe = url.protocol === 'https:' && !url.username && !url.password; } catch {}
    return safe ? <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a> : match[1];
  });
}
export default function Markdown({ body }) {
  return body.split(/\n\s*\n/).map((block, index) => {
    const diagram = parseDiagram(block.trim());
    if (diagram) return <Diagram key={index} {...diagram}/>;
    if (block.trim().startsWith('![')) return <p key={index}>{block}</p>;
    const lines = block.split('\n');
    if (lines.every(x => /^[-*] /.test(x))) return <ul key={index}>{lines.map((line, i) => <li key={i}>{inline(line.slice(2))}</li>)}</ul>;
    if (lines.every(x => /^\d+\. /.test(x))) return <ol key={index}>{lines.map((line, i) => <li key={i}>{inline(line.replace(/^\d+\. /, ''))}</li>)}</ol>;
    if (block.startsWith('## ')) return <h2 key={index}>{inline(block.slice(3))}</h2>;
    if (block.startsWith('### ')) return <h3 key={index}>{inline(block.slice(4))}</h3>;
    if (block.startsWith('> ')) return <blockquote key={index}>{inline(block.replace(/^> /gm, ''))}</blockquote>;
    return <p key={index}>{inline(block)}</p>;
  });
}
