import fs from 'node:fs';
import {loadContent} from './content.mjs';
import {validateSnapshot} from '../src/public-content.js';
import assert from 'node:assert/strict';
const snapshot=JSON.parse(fs.readFileSync(new URL('../public/content.json',import.meta.url)));
const canonical=rows=>[...rows].sort((a,b)=>a.id.localeCompare(b.id)).map(r=>JSON.parse(JSON.stringify(r)));
assert.deepEqual(canonical(validateSnapshot(snapshot)),canonical(loadContent()));
console.log(`公开Markdown与JSON一致：${snapshot.entries.length}条，版本${snapshot.updatedAt}；无需构建网页`);
