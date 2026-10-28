import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {diagramTitles,diagramId,parseDiagram} from '../src/diagrams.js';
test('only registered station-local SVG references are accepted',()=>{
 assert.equal(parseDiagram('![科创框架](/research/diagrams/star50.svg "图注")').id,'star50');
 for(const path of ['https://evil.test/a.svg','/research/diagrams/../a.svg','/research/diagrams/star50.svg?x=1','//evil.test/a.svg','/research/diagrams/unknown.svg','data:image/svg+xml,test'])assert.equal(diagramId(path),null);
});
test('seven diagrams contain editable text, accessible labels and no active content',()=>{
 assert.equal(Object.keys(diagramTitles).length,7);
 for(const id of Object.keys(diagramTitles)){
 const svg=fs.readFileSync(new URL(`../public/research/diagrams/${id}.svg`,import.meta.url),'utf8');
 assert.match(svg,/viewBox="0 0 1280 755"/);assert.match(svg,/研究框架示意图/);assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.match(svg,/<text/);
 assert.doesNotMatch(svg,/<(?:script|foreignObject|image|use|a)\b|\bon\w+\s*=|(?:href|src)\s*=|<!DOCTYPE|<!ENTITY/i);

 }
});
