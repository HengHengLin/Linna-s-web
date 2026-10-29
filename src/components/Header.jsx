import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { routeUrl } from '../routes';
export const navigation = [['home', '首页'], ['index-research', '指数与产业链研究'], ['knowledge', '研究知识网络'], ['research', '研究'], ['markets', '市场研究'], ['english', '英语实验室 / English Lab'], ['portfolio', '作品集']];
export default function Header({ page }) {
  const [menu, setMenu] = useState(false);
  useEffect(() => { const close = () => { setMenu(false); document.querySelector('.nav-market')?.removeAttribute('open'); }; window.addEventListener('hashchange', close); return () => window.removeEventListener('hashchange', close); }, []);
  return <header className="site-header"><div className="nav-inner">
    <a className="brand" href={routeUrl('home')} aria-label="Linna 研究实验室首页"><span className="brand-symbol">L<span>.</span></span><span>LINNA <b>研究实验室</b></span></a>
    <nav id="main-navigation" aria-label="主要导航" className={menu ? 'nav-links open' : 'nav-links'}>{navigation.map(([id, label]) => id === 'markets' ? <details className="nav-market" key={id}><summary>市场研究</summary><div><a href={routeUrl('markets')} onClick={()=>setMenu(false)}>市场与每日简报</a><a href={routeUrl('market-flow')} aria-current={page==='market-flow'?'page':undefined} onClick={()=>setMenu(false)}>市场资金监测</a></div></details> : <a key={id} href={routeUrl(id)} className={(page === id || (page === 'perspectives' && id === 'knowledge')) ? 'active' : ''} aria-current={(page === id || (page === 'perspectives' && id === 'knowledge')) ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</a>)}</nav>
    <button className="menu-btn" aria-label={menu ? '关闭菜单' : '打开菜单'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)} onKeyDown={e => { if (e.key === 'Escape') setMenu(false); }}>{menu ? <X/> : <Menu/>}</button>
  </div></header>;
}
