import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Markdown from './Markdown';
import { pageFor, routeUrl, statusLabel } from '../routes';
export default function Article({ entry }) {
  return <article className="container article">
    <a className="back" href={routeUrl(pageFor(entry.kind))}><ArrowLeft size={16}/>返回列表</a>
    <div className="article-label">{entry.category} · {entry.date} · {statusLabel(entry)}</div>
    <h1 tabIndex={-1}>{entry.title}</h1><p className="lead">{entry.oneLine || entry.summary}</p>
    <div className="pills">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    {entry.updatedAt && <p className="muted">更新于：{new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.updatedAt))}（北京时间）</p>}
    {entry.videoUrl ? <p><a href={entry.videoUrl} target="_blank" rel="noopener noreferrer">观看原视频 <ExternalLink size={14}/></a></p> : ['lesson', 'weekly'].includes(entry.kind) && <div className="notice">本模板尚未添加已核验的视频链接。</div>}
    {entry.transcriptUrl && <p><a href={entry.transcriptUrl} target="_blank" rel="noopener noreferrer">查看原始字幕来源</a></p>}
    <section className="markdown-body"><Markdown body={entry.body}/></section>
    <section><h2>参考资料</h2>{entry.sources.length ? <ul>{entry.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul> : <p>{entry.sourceType === 'owner-summary' ? entry.sourceNote : '演示模板尚未提供核验资料，不能作为已完成研究引用。'}</p>}</section>
  </article>;
}
