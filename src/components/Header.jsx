import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { routeUrl } from '../routes';
export const navigation = [['home', '首页'], ['index-research', '指数与产业链研究'], ['knowledge', '研究知识网络'], ['perspectives', '观点库'], ['research', '研究'], ['markets', '市场与简报'], ['english', '英语实验室'], ['trading', '交易日志'], ['portfolio', '作品集']];
export default function Header({ page }) {
  const [menu, setMenu] = useState(false);
  useEffect(() => { const close = () => setMenu(false); window.addEventListener('hashchange', close); return () => window.removeEventListener('hashchange', close); }, []);
  return <header className="site-header"><div className="nav-inner">
    <a className="brand" href={routeUrl('home')} aria-label="Linna 研究实验室首页"><span className="brand-symbol">L<span>.</span></span><span>LINNA <b>研究实验室</b></span></a>
    <nav id="main-navigation" aria-label="主要导航" className={menu ? 'nav-links open' : 'nav-links'}>{navigation.map(([id, label]) => <a key={id} href={routeUrl(id)} className={page === id ? 'active' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</a>)}</nav>
    <button className="menu-btn" aria-label={menu ? '关闭菜单' : '打开菜单'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)} onKeyDown={e => { if (e.key === 'Escape') setMenu(false); }}>{menu ? <X/> : <Menu/>}</button>
  </div></header>;
}
