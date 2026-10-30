import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateBook,validateReading} from '../src/reading/schema.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function loadBooks(directory=path.join(root,'content/reading')){
 const ids=new Set();return fs.readdirSync(directory).filter(f=>f.endsWith('.md')).sort().map(file=>{
 const text=fs.readFileSync(path.join(directory,file),'utf8');const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);if(!match)throw Error(`${file}: 缺少 JSON 元数据`);
 const book=validateBook({...JSON.parse(match[1]),body:match[2].trim()});if(file!==book.id+'.md'||ids.has(book.id))throw Error('文件名与唯一 ID 不一致');ids.add(book.id);return book;
 }).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
export function generateReading({check=false}={}){
 const books=loadBooks(),target=path.join(root,'public/reading.json');let old;try{old=validateReading(JSON.parse(fs.readFileSync(target,'utf8')));}catch{}
 const same=old&&JSON.stringify(old.books)===JSON.stringify(books);
 if(check){if(!same)throw Error('读书 Markdown 与公开快照不一致');return old;}
 const snapshot=same?old:{schemaVersion:1,updatedAt:new Date().toISOString(),books};
 fs.writeFileSync(target,JSON.stringify(snapshot,null,2)+'\n');fs.writeFileSync(path.join(root,'src/reading.generated.json'),JSON.stringify(books,null,2)+'\n');return snapshot;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const result=generateReading({check:process.argv.includes('--check')});console.log(`Reading: ${result.books.length} book(s), validated`);}
