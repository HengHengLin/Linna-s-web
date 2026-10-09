import test from 'node:test';
import assert from 'node:assert/strict';
import { filterEntries, parseRoute, routeUrl, pageFor } from '../src/routes.js';
test('shareable article URLs round-trip on reload', () => {
  assert.deepEqual(parseRoute(routeUrl('research', 'r1')), { page: 'research', id: 'r1' });
  assert.deepEqual(parseRoute(''), { page: 'home', id: null });
});
test('invalid navigation fails safely', () => {
  for (const hash of ['#/unknown', '#/research/a/b', '#/research/%zz']) assert.equal(parseRoute(hash).page, 'not-found');
});
test('learning filters combine date, tag and case-insensitive body search', () => {
  const entries = [{ title: '资产代币化', summary: '词汇练习', body: 'Underlying asset', category: 'RWA', tags: ['金融英语'], date: '2026-10-08' }];
  assert.equal(filterEntries(entries, { query: ' underlying ', category: '金融英语', date: '2026-10-08' }).length, 1);
  assert.equal(filterEntries(entries, { date: '2026-10-07' }).length, 0);
  assert.equal(filterEntries(entries, { category: '宏观' }).length, 0);
});
test('content types route to their correct public sections', () => {
  assert.equal(pageFor('briefing'), 'markets');
  assert.equal(pageFor('weekly'), 'english');
  assert.equal(pageFor('research'), 'research');
  assert.equal(pageFor('topic'), 'research');
});

import { matchesInterest } from '../src/interests.js';
test('research interests match Chinese and English topics without mixing unrelated fields', () => {
  assert.equal(matchesInterest({ title: 'AI drug discovery', tags: [] }, 'ai-biomed'), true);
  assert.equal(matchesInterest({ title: '卫星产业链', tags: [] }, 'aerospace'), true);
  assert.equal(matchesInterest({ title: 'Wyckoff supply and demand', tags: [] }, 'wyckoff'), true);
  assert.equal(matchesInterest({ title: '威科夫量价分析', tags: [] }, 'ai-biomed'), false);
  assert.equal(matchesInterest({ title: '新主题' }, ''), true);
});
