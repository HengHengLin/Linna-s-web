import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, BookOpen, ChevronRight, ExternalLink, GraduationCap, Mic2, Sparkles, LockKeyhole, Newspaper, Lightbulb, BriefcaseBusiness, Search } from 'lucide-react';
import initialEntries from './content.generated.json';
import {usePublicContent} from './sync/use-public-content';
import SyncStatus from './components/SyncStatus';
import { indices } from './market';
import { filterEntries, pageFor, parseRoute, routeUrl } from './routes';
import Header, { navigation } from './components/Header';
import Knowledge from './components/Knowledge';
import EmbodiedAI from './components/EmbodiedAI';
import Biopharma from './components/Biopharma';
import Aerospace from './components/Aerospace';
import IndexResearch from './components/IndexResearch';
import Cards from './components/Cards';
import Home from './components/Home';
import FlowMonitor from './components/FlowMonitor';
import MarketDashboard from './components/MarketDashboard';
import {visitorEntries} from './public-visibility';
import ResearchPage from './components/Research';
import Article from './components/Article';
import { researchRouteTitle } from './route-titles';
import './style.css';

const heading = (eyebrow, title, description) => <div className="page-heading"><span className="eyebrow blue">{eyebrow}</span><h1 tabIndex={-1}>{title}</h1><p>{description}</p></div>;
function Latest({ research, title = '近期研究' }) {
  return <><div className="section-row"><div><span className="eyebrow blue">持续研究</span><h2>{title}</h2></div><a className="text-link" href={routeUrl('research')}>查看全部研究 <ArrowUpRight size={16}/></a></div><Cards entries={research.slice(0, 3)}/></>;
}
function Research({ entries }) { return <ResearchPage research={entries.filter(x=>x.kind === 'research')} topics={entries.filter(x=>x.kind === 'topic')}/>; }
function Markets({ entries }) {
  const briefings = entries.filter(x=>x.kind === 'briefing');
  return <section className="container section">{heading('全球市场观察', '市场与每日简报', '从宏观、区域股市与数字资产出发，建立全球市场观察视角。')}<MarketDashboard/><details className="market-source-details"><summary>全部观察指数与原始行情入口</summary><div className="market-grid">{indices.map(x=><a className="market-card" key={x.ticker} href={x.url} target="_blank" rel="noopener noreferrer"><span className="eyebrow">{x.region}</span><h3>{x.name}</h3><p>{x.ticker}</p><span className="market-link">来源行情 <ExternalLink size={14}/></span></a>)}</div></details><div className="section-row top-gap"><div><span className="eyebrow blue">每日阅读</span><h2>财经简报</h2></div></div>{briefings.length ? <Cards entries={briefings}/> : <div className="empty-panel"><Newspaper size={28}/><h3>等待第一份经过核验的简报</h3><p>简报将包含宏观、股票与 Crypto 动态，并列出来源和更新时间。未经审核的自动生成内容不会作为个人观点发布。</p></div>}</section>;
}
function English({ entries }) {
 const materials=entries.filter(e=>['lesson','weekly'].includes(e.kind));
 const [query,setQuery]=useState(''),[date,setDate]=useState(''),[category,setCategory]=useState('');
 const matches=filterEntries(materials,{query,date,category});
 return <section className="container section">{heading('English Lab','英语实验室 / English Lab','用金融视频、词汇和表达练习，理解市场，也把想法说清楚。')}<form className="learning-filters" onSubmit={e=>e.preventDefault()}><label>关键词<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索主题、词汇或正文"/></label><label>主题<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">全部</option>{[...new Set(materials.map(e=>e.category))].map(x=><option key={x}>{x}</option>)}</select></label><label>日期<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><button type="button" className="text-link" onClick={()=>{setQuery('');setDate('');setCategory('');}}>重置</button></form><p className="muted" aria-live="polite">{matches.length} 份阅读与精听材料</p><Cards entries={matches}/></section>;
}
function Portfolio({ entries }) {
  const research = entries.filter(x=>x.kind === 'research');
  return <section className="container section">{heading('精选作品', '作品集与成长记录', '展示研究成果、AI 项目实践，以及持续积累的能力。')}<div className="portfolio-feature"><span className="eyebrow blue">项目展示 · 持续开发中</span><h2>Linna Research Lab</h2><p>通过 AI 辅助构建的个人研究与学习网站，涵盖产品规划、内容组织、功能迭代和技术验证。</p><div className="pills"><span>AI 辅助构建</span><span>产品思考</span><span>金融研究</span><span>英文沟通</span></div></div><section className="top-gap" aria-label="品牌方法实验室项目"><div className="portfolio-feature"><span className="eyebrow blue">网站项目 · 品牌研究</span><h2>品牌方法实验室</h2><p>围绕华与华的公开品牌方法，整理战略、超级符号与品牌资产的研究框架，结合案例拆解、咨询流程与互动练习，探索品牌方法如何应用。</p><div className="pills"><span>品牌策略</span><span>案例研究</span><span>互动工具</span></div><p className="fine">独立学习与研究项目，非华与华官方网站。</p><a className="primary" href="https://henghenglin.github.io/brand-method-lab/" target="_blank" rel="noopener noreferrer">访问品牌方法实验室 <ExternalLink size={17}/></a></div></section><div className="top-gap"><Latest research={research} title="研究展示"/></div></section>;
}
const components = { home: Home, 'index-research': IndexResearch, research: Research, markets: Markets, english: English, portfolio: Portfolio };
function App() {
  const {entries:rawEntries,sync,refresh}=usePublicContent(initialEntries);
  const entries=visitorEntries(rawEntries);
  const debug=import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug')==='sync';
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => { const onChange = () => setRoute(parseRoute(window.location.hash)); window.addEventListener('hashchange', onChange); return () => window.removeEventListener('hashchange', onChange); }, []);
  const entry = route.id ? entries.find(x => x.id === route.id && pageFor(x.kind) === route.page) : null;
  const Page = components[route.page];
  useEffect(() => {
    const title = researchRouteTitle(route) || (route.id ? entry?.title || '内容未找到' : navigation.find(([id]) => id === route.page)?.[1] || '页面未找到');
    document.title = `${title} | Linna 研究实验室`;
    document.querySelector('meta[name="description"]').content = entry?.summary || 'Linna 的投资研究、全球市场观察、金融英语与 AI 项目实践。';
    window.scrollTo(0, 0);
    document.querySelector('main h1')?.focus({ preventScroll: true });
  }, [route.page, route.id, entry?.title, entry?.summary]);
  return <><Header page={route.page}/>{debug && <SyncStatus sync={sync} entries={entries} refresh={refresh}/>}<main id="main-content">{route.page === 'market-flow' ? <FlowMonitor selectedId={route.id}/> : ['knowledge','perspectives'].includes(route.page) ? <Knowledge selectedId={route.id} entries={entries}/> : route.page === 'industry' && route.id === 'embodied-ai' ? <EmbodiedAI/> : route.page === 'industry' && route.id === 'biopharma' ? <Biopharma/> : route.page === 'industry' && route.id === 'aerospace' ? <Aerospace/> : route.page === 'index-research' ? <IndexResearch topicId={route.id}/> : route.id && entry ? <Article entry={entry}/> : route.id || !Page ? <section className="container section">{heading('页面未找到', '这条内容暂不可用', '请返回首页，或从研究与英语实验室中选择内容。')}<a className="primary" href={routeUrl('home')}>返回首页</a></section> : <Page key={route.page} entries={entries}/>}</main><footer><div className="container footer-inner"><div><strong>LINNA 研究实验室</strong><p>独立思考，持续学习。</p></div><div><span>以好奇心与 AI 构建</span><p>仅供学习交流 · © {new Date().getFullYear()}</p></div></div></footer></>;
}
createRoot(document.getElementById('root')).render(<App/>);
