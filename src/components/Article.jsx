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
    {entry.status === 'demo' && <div className="notice">这是公开演示模板，用于检查网站功能；不是 Linna 已批准的个人观点、真实学习记录或投资建议。</div>}
    {entry.status === 'curated' && <div className="notice">{entry.kind === 'topic' ? '这是基于公开资料推荐的研究选题，尚未形成 Linna 的研究文章或个人观点。' : entry.kind === 'briefing' ? '这是基于公开来源整理的事实简报，不代表 Linna 的个人观点。' : '这是为你准备的学习材料，尚不代表你已经完成学习。完成后发送总结，再建立当天学习记录。'}</div>}
    {entry.kind === 'journal' && <div className="learning-detail-intro"><strong>当天学习档案</strong><p>下方记录讨论主题、学习要点、纠正事项与下一步练习。研究观点另行确认后整理成文章。</p></div>}
    {entry.updatedAt && <p className="muted">更新于：{new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.updatedAt))}（北京时间）</p>}
    {entry.videoUrl ? <p><a href={entry.videoUrl} target="_blank" rel="noopener noreferrer">观看原视频 <ExternalLink size={14}/></a></p> : ['lesson', 'weekly'].includes(entry.kind) && <div className="notice">本模板尚未添加已核验的视频链接。</div>}
    {entry.transcriptUrl && <p><a href={entry.transcriptUrl} target="_blank" rel="noopener noreferrer">查看原始字幕来源</a></p>}
    <section className="markdown-body"><Markdown body={entry.body}/></section>
    <section><h2>参考资料</h2>{entry.sources.length ? <ul>{entry.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul> : <p>{entry.sourceType === 'owner-summary' ? entry.sourceNote : '演示模板尚未提供核验资料，不能作为已完成研究引用。'}</p>}</section>
  </article>;
}
