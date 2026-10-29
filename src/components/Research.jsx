import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Cards from './Cards';
import { pitches } from '../market';
import { researchInterests, matchesInterest } from '../interests';

export default function Research({ research, topics }) {
  const [all, setAll] = useState(false);
  const [interest, setInterest] = useState('');
  const label = researchInterests.find(x => x.id === interest)?.title;
  const articles = research.filter(x => matchesInterest(x, interest));
  const recommendations = topics.filter(x => matchesInterest(x, interest));
  const prompts = [...researchInterests.map(x => ({ id: x.id, topic: x.title, title: x.question, angle: x.angle })), ...pitches].filter(x => matchesInterest(x, interest));
  return <section className="container section">
    <div className="page-heading"><span className="eyebrow blue">独立思考</span><h1 tabIndex={-1}>研究与投资逻辑</h1><p>从自己关心的领域出发，收集证据、提出问题，再逐步形成有证据支持的研究文章。</p></div>
    <div className="section-row"><div><span className="eyebrow blue">近期关注</span><h2>持续探索的方向</h2></div></div>
    <div className="entry-grid research-directions">{researchInterests.map(x => <div className="entry static" key={x.id}><span className="eyebrow">研究方向</span><h3>{x.title}</h3><p>{x.description}</p><div className="pills">{x.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={() => setInterest(x.id)}>查看这个方向 <ArrowUpRight size={16}/></button></div>)}</div>
    <div className="learning-tabs top-gap" role="group" aria-label="研究方向筛选">{[['', '全部方向'], ...researchInterests.map(x => [x.id, x.title])].map(([id, title]) => <button key={id} className={interest === id ? 'chosen' : ''} aria-pressed={interest === id} onClick={() => setInterest(id)}>{title}</button>)}</div>
    <div className="section-row"><h2>{label ? `${label} · 研究文章` : all ? '全部研究与历史文章' : '最新研究'}</h2><button className="text-link" onClick={() => setAll(!all)}>{all ? '只看最新' : '查看全部 / 历史文章'} <ArrowUpRight size={16}/></button></div>
    <p className="muted" aria-live="polite">找到 {articles.length} 篇文章。</p>
    <Cards entries={all ? articles : articles.slice(0, 3)} empty="这个方向还没有研究文章。可以先从下方选一个问题，讨论并核验后再成文。"/>
    <div className="section-row top-gap"><div><span className="eyebrow blue">市场选题</span><h2>定期推荐的研究问题</h2></div></div>
    <p className="muted">从市场变化中寻找值得追踪的问题，再检验需求、竞争与现金流。</p>
    {recommendations.length ? <Cards entries={recommendations}/> : <div className="empty-panel"><p>暂没有这个范围的市场选题推荐，下面先提供固定问题作为研究起点。</p></div>}
    <div className="section-row top-gap"><h2>备选问题清单</h2></div><p className="muted">这些是待探索的问题，不代表当日热点、已验证结论或 Linna 的投资观点。</p>
    <div className="entry-grid">{prompts.map(x => <div className="entry static" key={x.id}><span className="eyebrow">{x.topic} · 待研究</span><h3>{x.title}</h3><p>{x.angle}</p><div className="entry-bottom"><span>继续追踪公开证据</span></div></div>)}</div>
  </section>;
}
