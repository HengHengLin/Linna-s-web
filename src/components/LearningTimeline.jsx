import React from 'react';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { routeUrl } from '../routes';

export default function LearningTimeline({ entries, compact = false }) {
  const records = entries.filter(x => x.kind === 'journal');
  const days = [...new Set(records.filter(x => x.status !== 'demo').map(x => x.date))];
  const groups = [...new Set(records.map(x => x.date))].sort().reverse();
  const visible = compact ? groups.slice(0, 3) : groups;
  return <div className="learning-timeline">
    {!compact && <p className="muted">已记录 {days.length} 天真实学习；演示记录单独标记，不计入学习天数。</p>}
    {!groups.length && <div className="empty-panel"><h3>等待你的第一份学习总结</h3><p>把与 ChatGPT 聊完后的总结发到这段对话，我会整理当天学到的知识、需要纠正的地方和下一步练习。</p></div>}
    {visible.map(date => <section className="learning-day" key={date}><div className="learning-date"><CalendarDays size={17}/><time dateTime={date}>{date}</time></div><div className="learning-day-records">{records.filter(x => x.date === date).map(entry => <a className="learning-record" key={entry.id} href={routeUrl('english', entry.id)}><div className="entry-top"><span className="eyebrow">{entry.category} · {entry.status === 'demo' ? '演示记录' : '学习总结'}</span><ArrowUpRight size={17}/></div><h3>{entry.title}</h3><p><strong>一句话总结：</strong>{entry.oneLine || entry.summary}</p><div className="pills">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div><span className="text-link">查看当天讨论、学习要点与纠正记录</span></a>)}</div></section>)}
  </div>;
}
