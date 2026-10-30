import React,{useEffect,useState} from 'react';
import initialBooks from '../reading.generated.json';
import {fetchReading} from '../reading/client';
import {searchBooks} from '../reading/schema';
import {routeUrl} from '../routes';
import Markdown from './Markdown';
export default function Reading({selectedId,books:provided}){
 const [books,setBooks]=useState(provided||initialBooks),[query,setQuery]=useState('');
 useEffect(()=>{if(provided)return;let active=true,previous;const refresh=async()=>{try{const snapshot=await fetchReading(previous);if(active){previous=snapshot;setBooks(snapshot.books);}}catch(error){console.warn('读书笔记暂用上次有效内容：',error.message);}};refresh();const focus=()=>{if(document.visibilityState==='visible')refresh();};window.addEventListener('focus',focus);const timer=setInterval(refresh,600000);return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',focus);};},[provided]);
 const book=books.find(b=>b.id===selectedId);
 useEffect(()=>{if(selectedId&&book)document.title=`${book.title} · 读书笔记 | Linna 研究实验室`;},[selectedId,book]);
 if(selectedId&&!book)return <section className="container section"><h1>未找到这本书</h1><a href={routeUrl('reading')}>返回读书笔记</a></section>;
 if(book)return <article className="container section reading-detail"><a className="text-link" href={routeUrl('reading')}>← 全部读书笔记</a><header className="page-heading"><span className="eyebrow blue">READING NOTES · 原创整理与评论</span><h1 tabIndex={-1}>《{book.title}》</h1><p>{book.originalTitle} · {book.author} · 首版 {book.publicationYear}</p><p>{book.summary}</p><p className="fine">整理日期 {book.date} · 主题概括与批判性分析，非原书全文或逐章替代。</p></header><div className="reading-body"><Markdown body={book.body}/></div><section className="reading-sources"><h2>原始资料与延伸阅读</h2><ul>{book.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a><span className="fine"> · 核验 {s.checkedAt}</span></li>)}</ul></section></article>;
 const matches=searchBooks(books,query);
 return <section className="container section"><div className="page-heading"><span className="eyebrow blue">LINNA READING NOTES</span><h1 tabIndex={-1}>读书笔记</h1><p>从一本书出发，追问它能解释什么、不能解释什么，以及如何改变决策。</p></div><label className="reading-search">查找书籍<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="书名、作者或主题"/></label><div className="reading-grid">{matches.map(b=><a className="reading-card" key={b.id} href={routeUrl('reading',b.id)}><span className="eyebrow blue">{b.tags.join(' · ')}</span><h2>{b.title}</h2><p className="muted">{b.author}</p><p>{b.summary}</p><span className="text-link">阅读笔记 →</span></a>)}</div>{!matches.length&&<p role="status">没有符合条件的书籍。</p>}</section>;
}
