import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSnapshot } from '../src/public-content.js';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const kinds = ['research', 'journal', 'lesson', 'weekly', 'briefing', 'topic'];
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
}
export function parseContent(text, file = 'content') {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw Error(`${file}：需要 JSON 元数据和 Markdown 正文`);
  const meta = JSON.parse(match[1]);
  const fail = message => { throw Error(`${file}：${message}`); };
  if (!/^[a-z0-9][a-z0-9-]*$/.test(meta.id || '')) fail('id 只能使用小写字母、数字和连字符');
  if (!kinds.includes(meta.kind)) fail('内容类型无效');
  for (const key of ['title', 'summary', 'category']) {
    if (typeof meta[key] !== 'string' || !meta[key].trim()) fail(`缺少 ${key}`);
  }
  if (!validDate(meta.date)) fail('日期必须是真实的 YYYY-MM-DD 日期');
  if (!Array.isArray(meta.tags) || !meta.tags.length || meta.tags.some(x => typeof x !== 'string' || !x.trim())) fail('需要非空标签数组');
  if (!['demo', 'approved', 'curated'].includes(meta.status)) fail('公开目录只允许 demo、approved 或 curated；未审核观点请保存在仓库外');
  if (meta.status === 'curated' && (!['lesson', 'weekly', 'briefing', 'topic'].includes(meta.kind) || meta.ownerViewpoint !== false || meta.sourceVerified !== true)) fail('curated 只用于核验的学习材料、事实简报或选题，必须明确不是个人观点');
  if (meta.kind === 'journal' && (typeof meta.oneLine !== 'string' || !meta.oneLine.trim())) fail('学习记录需要 oneLine 一句话总结');
  if (meta.kind === 'journal' && meta.status === 'approved' && (meta.sourceType !== 'owner-summary' || typeof meta.sourceNote !== 'string' || !meta.sourceNote.trim())) fail('学习记录必须标明用户提供的总结来源');
  if (meta.status === 'approved' && (!validDate(meta.approvedAt) || meta.approvedBy !== 'Linna')) fail('正式内容需要 Linna 的批准日期与署名');
  if (!Array.isArray(meta.sources)) fail('sources 必须是数组');
  for (const source of meta.sources) if (typeof source.title !== 'string' || !source.title.trim() || !safeUrl(source.url)) fail('来源需要标题和 HTTPS 地址');
  for (const key of ['videoUrl', 'transcriptUrl']) if (meta[key] && !safeUrl(meta[key])) fail(`${key} 必须为 HTTPS 地址`);
  if (['approved', 'curated'].includes(meta.status)) {
    if (!meta.sources.length && !(meta.kind === 'journal' && meta.sourceType === 'owner-summary')) fail('正式发布必须提供来源');
    if (['lesson', 'weekly'].includes(meta.kind) && (!meta.videoUrl || meta.sourceVerified !== true)) fail('视频学习内容需要核验视频来源');
    if (meta.kind === 'briefing' && (!meta.updatedAt || Number.isNaN(Date.parse(meta.updatedAt)) || !/[+-]\d\d:\d\d$|Z$/.test(meta.updatedAt))) fail('简报需要含时区的更新时间');
  }
  const body = match[2].trim();
  if (!body) fail('正文不能为空');
  if (meta.kind === 'journal' && meta.status === 'approved') {
    for (const section of ['今天聊了什么', '今天学到了什么', '需要纠正与巩固的地方', '详细学习总结', '下一步练习']) {
      if (!body.includes(`## ${section}`)) fail(`学习记录缺少：${section}`);
    }
  }
  return { ...meta, body };
}
export function loadContent(directory = path.join(root, 'content/public')) {
  const entries = fs.readdirSync(directory).filter(x => x.endsWith('.md')).sort()
    .map(file => parseContent(fs.readFileSync(path.join(directory, file), 'utf8'), file));
  if (entries.some(e => e.kind === 'journal')) throw Error('学习记录已退出公开目录，请保存至仓库外私有归档');
  if (new Set(entries.map(x => x.id)).size !== entries.length) throw Error('存在重复内容 ID');
  return entries.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
export function generate() {
  const entries = loadContent();
  const snapshot = { schemaVersion: 1, updatedAt: new Date().toISOString(), entries };
  validateSnapshot(snapshot);
  fs.mkdirSync(path.join(root, 'public'), { recursive: true });
  const previous = path.join(root, 'public/content.json');
  let unchanged = false;
  try { unchanged = JSON.stringify(JSON.parse(fs.readFileSync(previous, 'utf8')).entries) === JSON.stringify(entries); } catch {}
  if (!unchanged) fs.writeFileSync(previous, JSON.stringify(snapshot, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'src/content.generated.json'), JSON.stringify(entries, null, 2) + '\n');
  console.log(`内容校验通过：${entries.length} 条，正式发布 ${entries.filter(x => x.status === 'approved').length} 条，演示 ${entries.filter(x => x.status === 'demo').length} 条`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
