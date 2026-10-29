import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import Cards from './Cards';
import {routeUrl} from '../routes';
export default function Home({entries=[]}) {
 const featured=entries.filter(e=>e.kind==='research'&&e.status==='approved').slice(0,3);
 return <>
  <section className="personal-hero"><div className="container personal-hero-grid"><div><p className="eyebrow">LINNA · 研究与实践</p><h1 tabIndex={-1}>你好，我是 Linna。<br/><em>从好奇出发，<br/>把问题研究清楚。</em></h1><p className="personal-intro">我关注金融市场、产业变化与技术如何创造商业价值。在这里，我分享研究、记录项目，也探索如何用 AI 把想法变成可使用的作品。</p><a className="primary" href={routeUrl('research')}>阅读我的研究 <ArrowUpRight size={17}/></a></div><aside className="personal-note"><span className="personal-monogram" aria-hidden="true">L.</span><p className="eyebrow">持续关注</p><h2>理解业务，<br/>再理解投资。</h2><p>AI 与生物医药 · 航空航天<br/>指数与产业链 · Crypto 与 RWA</p><p className="fine">以公开证据为起点，保留反方解释，让判断接受验证。</p></aside></div></section>
  <section className="container section"><div className="section-row"><div><span className="eyebrow blue">研究作品</span><h2>精选文章</h2></div><a className="text-link" href={routeUrl('research')}>全部研究 <ArrowUpRight size={16}/></a></div><Cards entries={featured} empty="新的研究正在整理中。"/></section>
  <section className="container section home-projects"><div className="section-row"><div><span className="eyebrow blue">从研究到构建</span><h2>项目与 AI 实践</h2></div><a className="text-link" href={routeUrl('portfolio')}>作品集 <ArrowUpRight size={16}/></a></div><div className="project-pair"><a className="project-card" href={routeUrl('index-research')}><span className="eyebrow">金融研究项目</span><h3>Linna Research Lab</h3><p>把指数、产业链、公司与公开资料串联起来，用可交互的教学模型检验商业逻辑。</p><span>探索研究资料库 →</span></a><a className="project-card" href="https://henghenglin.github.io/brand-method-lab/" target="_blank" rel="noopener noreferrer"><span className="eyebrow">品牌研究项目</span><h3>品牌方法实验室</h3><p>以公开方法与案例探索品牌策略、超级符号及品牌资产，并尝试把分析转化为互动工具。</p><span>访问独立学习项目 ↗</span></a></div></section>
 </>;
}
