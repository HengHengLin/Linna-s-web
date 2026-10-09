export const CONTENT_URL = 'https://raw.githubusercontent.com/HengHengLin/Linna-s-web/main/public/content.json';
const https = value => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } };
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
export function validateSnapshot(snapshot) {
  if (snapshot?.schemaVersion !== 1 || !Array.isArray(snapshot.entries) || snapshot.entries.length > 5000 || !snapshot.updatedAt || Number.isNaN(Date.parse(snapshot.updatedAt))) throw Error('公开内容格式无效');
  const ids = new Set();
  for (const x of snapshot.entries) {
    if (!x || !/^[a-z0-9][a-z0-9-]*$/.test(x.id || '') || ids.has(x.id)) throw Error('文章编号无效或重复');
    ids.add(x.id);
    if (!['research', 'journal', 'lesson', 'weekly', 'briefing', 'topic'].includes(x.kind) || !['demo', 'approved', 'curated'].includes(x.status)) throw Error('非公开内容不得进入网站');
    if (['title','summary','category','body'].some(key => typeof x[key] !== 'string' || !x[key].trim()) || !date(x.date) || !Array.isArray(x.tags) || !x.tags.length || x.tags.some(tag=>typeof tag !== 'string')) throw Error('文章字段无效');
    if (!Array.isArray(x.sources) || x.sources.some(s=>!s || typeof s.title !== 'string' || !s.title.trim() || !https(s.url))) throw Error('来源无效');
    for (const key of ['videoUrl','transcriptUrl']) if (x[key] && !https(x[key])) throw Error('链接不安全');
    if (x.updatedAt && Number.isNaN(Date.parse(x.updatedAt))) throw Error('更新时间无效');
    if (x.status === 'approved' && (x.approvedBy !== 'Linna' || !date(x.approvedAt))) throw Error('文章未经过批准');
    if (x.status === 'curated' && (!['lesson','weekly','briefing','topic'].includes(x.kind) || x.ownerViewpoint !== false || x.sourceVerified !== true)) throw Error('自动素材不能冒充个人观点');
    if (x.status !== 'demo') {
      if (!x.sources.length && !(x.kind === 'journal' && x.sourceType === 'owner-summary' && typeof x.sourceNote === 'string' && x.sourceNote.trim())) throw Error('缺少可核验来源');
      if (['lesson','weekly'].includes(x.kind) && (!https(x.videoUrl) || x.sourceVerified !== true)) throw Error('缺少核验的视频');
      if (x.kind === 'briefing' && (!x.updatedAt || !/[+-]\d\d:\d\d$|Z$/.test(x.updatedAt))) throw Error('简报缺少时区');
    }
    if (x.kind === 'journal' && (typeof x.oneLine !== 'string' || !x.oneLine.trim())) throw Error('学习总结缺失');
    if (x.kind === 'journal' && x.status === 'approved') {
      if (x.sourceType !== 'owner-summary' || typeof x.sourceNote !== 'string' || !x.sourceNote.trim()) throw Error('学习总结来源缺失');
      for (const section of ['今天聊了什么','今天学到了什么','需要纠正与巩固的地方','详细学习总结','下一步练习']) if (!x.body.includes(`## ${section}`)) throw Error('学习总结不完整');
    }
  }
  return [...snapshot.entries].sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
