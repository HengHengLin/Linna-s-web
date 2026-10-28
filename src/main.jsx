import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, BookOpen, ChevronRight, ExternalLink, GraduationCap, Mic2, Sparkles, LockKeyhole, Newspaper, Lightbulb, BriefcaseBusiness, Search } from 'lucide-react';
import initialEntries from './content.generated.json';
import { CONTENT_URL, validateSnapshot } from './public-content';
import { indices } from './market';
import { filterEntries, pageFor, parseRoute, routeUrl } from './routes';
import Header, { navigation } from './components/Header';
import IndexResearch from './components/IndexResearch';
import Cards from './components/Cards';
import LearningTimeline from './components/LearningTimeline';
import ResearchPage from './components/Research';
import Article from './components/Article';
import './style.css';

const heading = (eyebrow, title, description) => <div className="page-heading"><span className="eyebrow blue">{eyebrow}</span><h1 tabIndex={-1}>{title}</h1><p>{description}</p></div>;
function Latest({ research, title = '近期研究' }) {
  return <><div className="section-row"><div><span className="eyebrow blue">持续研究</span><h2>{title}</h2></div><a className="text-link" href={routeUrl('research')}>查看全部研究 <ArrowUpRight size={16}/></a></div><Cards entries={research.slice(0, 3)}/></>;
}
function Home({ entries }) {
  const research = entries.filter(x=>x.kind === 'research');
  const english = entries.filter(x=>['lesson','weekly','journal'].includes(x.kind));
  return <>
    <section className="hero"><div className="container hero-inner"><div><div className="hero-kicker"><span className="pulse"/>独立研究 · 数字资产</div><h1 tabIndex={-1}>在分享中学习。<br/><em>在研究中独立思考。</em></h1><p>投资研究、全球市场、金融英语与 AI 项目实践。记录一个问题如何逐步变成清晰的理解。</p><div className="hero-actions"><a className="primary" href={routeUrl('research')}>阅读研究 <ArrowUpRight size={17}/></a><a className="outline-light" href={routeUrl('markets')}>市场概览 <ChevronRight size={17}/></a></div><div className="hero-tags"><span>投资</span><span>宏观</span><span>RWA</span><span>Crypto</span><span>金融英语</span></div></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit1"/><div className="orbit orbit2"/><div className="orbit orbit3"/><div className="center-mark">L.</div><span className="art-note n1">研究</span><span className="art-note n2">构建</span><span className="art-note n3">学习</span></div></div></section>
    <section className="container section"><div className="section-intro"><div><span className="eyebrow blue">探索实验室</span><h2>不同的探索方向。<br/>持续积累的思考。</h2></div><p>将研究、市场观察、英文学习与项目作品整理为清晰的公开档案。</p></div><div className="feature-grid">{[[BookOpen, '研究', '投资逻辑、研究框架与独立观点。', 'research'], [Newspaper, '市场与简报', '全球指数入口与经过审核的财经简报。', 'markets'], [GraduationCap, '英语实验室', '金融英语、学习笔记与演讲精听。', 'english'], [BriefcaseBusiness, '作品集', '研究成果与 AI 项目实践。', 'portfolio']].map(([Icon, title, description, page]) => <a className="feature" key={page} href={routeUrl(page)}><Icon size={25}/><h3>{title}</h3><p>{description}</p><span>开始探索 <ArrowUpRight size={15}/></span></a>)}</div></section>
    <section className="container section latest"><div className="notice">目前的文章是功能演示模板，均已明确标注。正式研究需由 Linna 审核后发布。</div><Latest research={research}/></section><section className="container section latest"><div className="section-row"><div><span className="eyebrow blue">每天一点积累</span><h2>今天学到了什么</h2></div><a className="text-link" href={routeUrl('english')}>查看学习档案 <ArrowUpRight size={16}/></a></div><LearningTimeline entries={english} compact/></section><section className="container section latest"><div className="section-row"><div><span className="eyebrow blue">随时回来补学</span><h2>最新学习材料</h2></div><a className="text-link" href={routeUrl('english')}>查看全部与历史材料 <ArrowUpRight size={16}/></a></div><p className="muted">材料会直接更新在这里，错过当天也可以从历史日期继续学习。</p><Cards entries={english.filter(x => x.status === 'curated' && ['lesson', 'weekly'].includes(x.kind)).slice(0, 3)}/></section><section className="manifesto"><div className="container"><Sparkles size={26}/><h2>好奇心是起点。<br/>清晰的思考是方向。</h2><p>公开研究用于学习与交流，不构成投资建议。</p></div></section>
  </>;
}
function Research({ entries }) { return <ResearchPage research={entries.filter(x=>x.kind === 'research')} topics={entries.filter(x=>x.kind === 'topic')}/>; }
function Markets({ entries }) {
  const briefings = entries.filter(x=>x.kind === 'briefing');
  return <section className="container section">{heading('全球市场观察', '市场与每日简报', '从宏观、区域股市与数字资产出发，建立全球市场观察视角。')}<div className="notice"><strong>行情说明：</strong>当前提供外部行情页面入口，不显示实时价格或涨跌幅。数据来源为 Yahoo Finance，行情时点与延迟以来源页面为准。</div><div className="section-row"><h2>全球主要股指</h2><span className="eyebrow">8 个观察指数</span></div><div className="market-grid">{indices.map(x => <a className="market-card" key={x.ticker} href={x.url} target="_blank" rel="noopener noreferrer"><span className="eyebrow">{x.region}</span><h3>{x.name}</h3><p>{x.ticker}</p><span className="market-link">查看来源行情 <ExternalLink size={14}/></span></a>)}</div><div className="section-row top-gap"><div><span className="eyebrow blue">每日阅读</span><h2>财经简报</h2></div></div>{briefings.length ? <Cards entries={briefings}/> : <div className="empty-panel"><Newspaper size={28}/><h3>等待第一份经过核验的简报</h3><p>简报将包含宏观、股票与 Crypto 动态，并列出来源和更新时间。未经审核的自动生成内容不会作为个人观点发布。</p></div>}</section>;
}
function English({ entries }) {
  const english = entries.filter(x=>['lesson','weekly','journal'].includes(x.kind));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [view, setView] = useState('materials');
  const matches = filterEntries(english, { query, category, date });
  const lessons = matches.filter(x => x.kind !== 'journal');
  return <section className="container section">
    {heading('每天一点积累', '英语与每日学习档案', '把每日讨论整理成一句话总结，再展开查看学到的知识、需要纠正的地方与下一步练习。')}
    <div className="split-intro"><div><Mic2/><h3>每日金融英语材料</h3><p>先准备视频、词汇与练习。完成学习后，再把你的总结整理为当天记录。</p></div><div><GraduationCap/><h3>从讨论到研究文章</h3><p>学习笔记记录理解与纠正；投资观点单独讨论、核验并确认后，发布到研究板块。</p></div></div>
    <p className="muted">每天准备的材料直接保存在这里，历史内容持续保留；可以按日期补学，完成后把总结发给我归档。</p><div className="learning-workflow"><span>准备材料</span><ChevronRight size={16}/><span>与 ChatGPT 学习讨论</span><ChevronRight size={16}/><span>把总结发给我</span><ChevronRight size={16}/><span>形成每日档案</span></div>
    <div className="learning-tabs" role="group" aria-label="学习内容分类"><button aria-pressed={view === 'journal'} className={view === 'journal' ? 'chosen' : ''} onClick={() => setView('journal')}>每日学习记录</button><button aria-pressed={view === 'materials'} className={view === 'materials' ? 'chosen' : ''} onClick={() => setView('materials')}>待学习材料与练习</button></div>
    <form className="learning-filters" onSubmit={e => e.preventDefault()} aria-label="学习记录检索"><label><span>关键词</span><div className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索标题、词汇或正文"/></div></label><label><span>主题</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">全部主题</option>{[...new Set(english.flatMap(x => [x.category, ...x.tags]))].sort().map(x => <option key={x}>{x}</option>)}</select></label><label><span>日期</span><select aria-label="日期" value={date} onChange={e => setDate(e.target.value)}><option value="">全部日期</option>{[...new Set(english.map(x => x.date))].sort().reverse().map(day => <option key={day}>{day}</option>)}</select></label><button className="text-link" type="button" onClick={() => { setQuery(''); setCategory(''); setDate(''); }}>重置筛选</button></form>
    <p className="muted" aria-live="polite">找到 {view === 'journal' ? matches.filter(x => x.kind === 'journal').length : lessons.length} 条{view === 'journal' ? '学习记录' : '学习材料'}</p>
    {view === 'journal' ? <LearningTimeline entries={matches}/> : lessons.length ? [['lesson', '每日视频与金融英语'], ['weekly', '每周演讲精听']].map(([kind, title]) => lessons.some(x => x.kind === kind) && <section key={kind}><div className="section-row top-gap"><h2>{title}</h2></div><Cards entries={lessons.filter(x => x.kind === kind)}/></section>) : <div className="empty-panel"><h3>暂无符合条件的材料</h3><p>请调整筛选条件，或等待下一次核验后的材料更新。</p></div>}
  </section>;
}
function Trading() {
  return <section className="container section">{heading('私人空间', '交易日志', '可靠的身份验证和访问控制完成前，真实交易日志暂不开放。')}<div className="notice"><LockKeyhole size={18}/><strong>录入与上传已禁用。</strong>当前网站不会读取、展示或写入浏览器中的旧交易日志，也不提供私人数据上传接口。</div><div className="empty-panel top-gap"><LockKeyhole size={30}/><h3>私人交易空间尚未启用</h3><p>只有登录、服务端权限校验及私人数据隔离通过测试后，才会开放记录与复盘。已有浏览器记录不会被此版本删除。</p></div></section>;
}
function Portfolio({ entries }) {
  const research = entries.filter(x=>x.kind === 'research');
  return <section className="container section">{heading('精选作品', '作品集与成长记录', '展示研究成果、AI 项目实践，以及持续积累的能力。')}<div className="portfolio-feature"><span className="eyebrow blue">项目展示 · 持续开发中</span><h2>Linna Research Lab</h2><p>通过 AI 辅助构建的个人研究与学习网站，涵盖产品规划、内容组织、功能迭代和技术验证。</p><div className="pills"><span>AI 辅助构建</span><span>产品思考</span><span>金融研究</span><span>英文沟通</span></div><p className="fine">职业经历与项目成果会在确认后补充，不将演示内容当作真实成果。</p></div><section className="top-gap" aria-label="品牌方法实验室项目"><div className="portfolio-feature"><span className="eyebrow blue">网站项目 · 品牌研究</span><h2>品牌方法实验室</h2><p>围绕华与华的公开品牌方法，整理战略、超级符号与品牌资产的研究框架，结合案例拆解、咨询流程与互动练习，探索品牌方法如何应用。</p><div className="pills"><span>品牌策略</span><span>案例研究</span><span>互动工具</span></div><p className="fine">独立学习与研究项目，非华与华官方网站。</p><a className="primary" href="https://henghenglin.github.io/brand-method-lab/" target="_blank" rel="noopener noreferrer">访问品牌方法实验室 <ExternalLink size={17}/></a></div></section><div className="top-gap"><Latest research={research} title="研究展示"/></div><div className="empty-panel top-gap"><Lightbulb size={24}/><h3>职业与项目时间线</h3><p>后续记录角色、职责、项目成果与学习到的能力。只发布经确认且不涉及保密信息的内容。</p></div></section>;
}
const components = { home: Home, 'index-research': IndexResearch, research: Research, markets: Markets, english: English, trading: Trading, portfolio: Portfolio };
function App() {
  const [entries, setEntries] = useState(initialEntries);
  const [sync, setSync] = useState({ state: 'loading', updatedAt: null });
  useEffect(() => {
    let active = true;
    let running = false;
    async function refresh() {
      if (running) return;
      running = true;
      try {
        const response = await fetch(CONTENT_URL, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw Error('远程内容暂不可用');
        const snapshot = await response.json();
        const next = validateSnapshot(snapshot);
        if (active) { setEntries(next); setSync({ state: 'ready', updatedAt: snapshot.updatedAt }); }
      } catch { if (active) setSync(previous => ({ ...previous, state: 'stale' })); }
      finally { running = false; }
    }
    refresh();
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 600000);
    return () => { active = false; window.removeEventListener('focus', refresh); window.clearInterval(timer); };
  }, []);
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => { const onChange = () => setRoute(parseRoute(window.location.hash)); window.addEventListener('hashchange', onChange); return () => window.removeEventListener('hashchange', onChange); }, []);
  const entry = route.id ? entries.find(x => x.id === route.id && pageFor(x.kind) === route.page) : null;
  const Page = components[route.page];
  useEffect(() => {
    const title = route.id ? (route.page === 'index-research' ? '指数与产业链研究' : entry?.title) || '内容未找到' : navigation.find(([id]) => id === route.page)?.[1] || '页面未找到';
    document.title = `${title} | Linna 研究实验室`;
    document.querySelector('meta[name="description"]').content = entry?.summary || 'Linna 的投资研究、全球市场观察、金融英语与 AI 项目实践。';
    window.scrollTo(0, 0);
    document.querySelector('main h1')?.focus({ preventScroll: true });
  }, [route.page, route.id, entry?.title, entry?.summary]);
  return <><Header page={route.page}/><main id="main-content">{route.page === 'index-research' ? <IndexResearch topicId={route.id}/> : route.id && entry ? <Article entry={entry}/> : route.id || !Page ? <section className="container section">{heading('页面未找到', '这条内容暂不可用', '请返回首页，或从研究与英语实验室中选择内容。')}<a className="primary" href={routeUrl('home')}>返回首页</a></section> : <Page key={route.page} entries={entries}/>}</main><footer><div className="container footer-inner"><div><strong>LINNA 研究实验室</strong><p>独立思考，持续学习。</p></div><div><span>以好奇心与 AI 构建</span><p>仅供学习交流 · © {new Date().getFullYear()}</p><p role="status">{sync.state === 'loading' ? '正在同步云端内容…' : sync.state === 'stale' ? '云端同步暂不可用，当前显示已有内容。' : `云端内容已同步 · ${new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', dateStyle: 'short', timeStyle: 'short' }).format(new Date(sync.updatedAt))}（北京时间）`}</p></div></div></footer></>;
}
createRoot(document.getElementById('root')).render(<App/>);
