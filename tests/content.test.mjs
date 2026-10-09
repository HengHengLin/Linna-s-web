import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadContent, parseContent, validDate } from '../scripts/content.mjs';
const metadata = { id: 'test-entry', kind: 'research', title: '研究', summary: '摘要', category: 'RWA', date: '2026-10-10', tags: ['RWA'], status: 'demo', sources: [] };
const document = (changes = {}) => `---\n${JSON.stringify({ ...metadata, ...changes })}\n---\n\n## 正文\n\n研究问题。`;
test('public content validates with unique IDs as the archive grows', () => {
  const entries = loadContent();
  assert.ok(entries.length > 0);
  assert.equal(new Set(entries.map(x => x.id)).size, entries.length);
});
test('unreviewed material is rejected rather than silently published', () => {
  for (const status of ['draft', 'pending', '']) assert.throws(() => parseContent(document({ status })), /只允许/);
});
test('formal articles need owner approval and valid sources', () => {
  assert.throws(() => parseContent(document({ status: 'approved' })), /批准/);
  assert.throws(() => parseContent(document({ status: 'approved', approvedBy: 'Linna', approvedAt: '2026-10-10' })), /提供来源/);
  assert.equal(parseContent(document({ status: 'approved', approvedBy: 'Linna', approvedAt: '2026-10-10', sources: [{ title: '原始资料', url: 'https://example.com/source' }] })).status, 'approved');
});
test('unsafe source/video URL protocols and embedded credentials are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://example.com', 'https://user:password@example.com']) {
    assert.throws(() => parseContent(document({ sources: [{ title: 'source', url }] })), /HTTPS/);
    assert.throws(() => parseContent(document({ videoUrl: url })), /HTTPS/);
  }
});
test('calendar dates reject non-existent days', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2024-02-29'), true);
  assert.throws(() => parseContent(document({ date: '2026-13-10' })), /日期/);
});
test('approved video lessons require verified video sources', () => {
  const approved = { status: 'approved', approvedBy: 'Linna', approvedAt: '2026-10-10', sources: [{ title: '来源', url: 'https://example.com' }], kind: 'lesson' };
  assert.throws(() => parseContent(document(approved)), /核验视频/);
  assert.equal(parseContent(document({ ...approved, videoUrl: 'https://example.com/video', sourceVerified: true })).kind, 'lesson');
});
test('briefings require an update timestamp with timezone', () => {
  const briefing = { status: 'approved', approvedBy: 'Linna', approvedAt: '2026-10-10', sources: [{ title: '来源', url: 'https://example.com' }], kind: 'briefing' };
  assert.throws(() => parseContent(document({ ...briefing, updatedAt: '2026-10-10T12:00:00' })), /时区/);
  assert.equal(parseContent(document({ ...briefing, updatedAt: '2026-10-10T12:00:00+08:00' })).kind, 'briefing');
});
test('duplicate content IDs fail validation', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'linna-content-test-'));
  try { fs.writeFileSync(path.join(directory, 'a.md'), document()); fs.writeFileSync(path.join(directory, 'b.md'), document()); assert.throws(() => loadContent(directory), /重复/); }
  finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test('curated learning materials cannot be represented as personal research or completed journals', () => {
  const curated = { status: 'curated', ownerViewpoint: false, sourceVerified: true, sources: [{ title: '资料', url: 'https://example.com' }] };
  assert.throws(() => parseContent(document(curated)), /不是个人观点/);
  assert.throws(() => parseContent(document({ ...curated, kind: 'journal', oneLine: '总结' })), /不是个人观点/);
  assert.equal(parseContent(document({ ...curated, kind: 'topic' })).status, 'curated');
  assert.throws(() => parseContent(document({ ...curated, kind: 'lesson' })), /核验视频/);
  assert.equal(parseContent(document({ ...curated, kind: 'lesson', videoUrl: 'https://example.com/video' })).kind, 'lesson');
});
test('owner-provided learning summaries have traceable origins and required correction sections', () => {
  const journal = { kind: 'journal', status: 'approved', approvedBy: 'Linna', approvedAt: '2026-10-10', oneLine: '学习到知识之间的区别', sourceType: 'owner-summary', sourceNote: '用户在本聊天发来的学习总结。' };
  const body = ['今天聊了什么', '今天学到了什么', '需要纠正与巩固的地方', '详细学习总结', '下一步练习'].map(title => `## ${title}\n\n来自用户提供的总结。`).join('\n\n');
  assert.throws(() => parseContent(document(journal)), /学习记录缺少/);
  const content = document(journal).replace('## 正文\n\n研究问题。', body);
  assert.equal(parseContent(content).sources.length, 0);
  assert.throws(() => parseContent(content.replace('"owner-summary"', '"generated"')), /总结来源/);
  assert.throws(() => parseContent(document({ ...journal, oneLine: '' })), /一句话总结/);
});
