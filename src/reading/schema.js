const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value+'T00:00:00Z').toISOString().startsWith(value);
export function validateBook(book) {
  const fields=['id','title','originalTitle','author','publicationYear','date','summary','tags','status','ownerViewpoint','sourceVerified','visibility','sources','body'];
  if (!book || Object.keys(book).some(key=>!fields.includes(key))) throw Error('书籍字段不受支持');
  if (!/^[a-z][a-z0-9-]{1,79}$/.test(book.id) || !date(book.date)) throw Error('书籍 ID 或日期无效');
  for(const key of ['title','originalTitle','author','summary','body']) if(typeof book[key]!=='string'||!book[key].trim()||book[key].length>(key==='body'?80000:500)) throw Error('书籍文字字段无效');
  if(!Number.isInteger(book.publicationYear)||book.publicationYear<1400||book.publicationYear>2100) throw Error('出版年份无效');
  if(book.status!=='curated'||book.ownerViewpoint!==false||book.sourceVerified!==true||book.visibility!=='public') throw Error('仅接收经过来源核验的公开原创整理');
  if(!Array.isArray(book.tags)||book.tags.some(x=>typeof x!=='string'||x.length>40)) throw Error('标签无效');
  if(!Array.isArray(book.sources)||!book.sources.length) throw Error('缺少来源');
  for(const source of book.sources){let url;try{url=new URL(source.url);}catch{throw Error('来源网址无效');}if(url.protocol!=='https:'||url.username||url.password||!source.title||!date(source.checkedAt)||Object.keys(source).some(k=>!['url','title','checkedAt'].includes(k)))throw Error('来源格式无效');}
  return book;
}
export function validateReading(snapshot){
  if(snapshot?.schemaVersion!==1||!Number.isFinite(Date.parse(snapshot.updatedAt))||!Array.isArray(snapshot.books)||snapshot.books.length>1000) throw Error('读书笔记快照无效');
  const ids=new Set();for(const book of snapshot.books){validateBook(book);if(ids.has(book.id))throw Error('重复书籍 ID');ids.add(book.id);}return snapshot;
}
export function searchBooks(books,query=''){const term=query.trim().toLocaleLowerCase();return books.filter(b=>`${b.title} ${b.originalTitle} ${b.author} ${b.tags.join(' ')} ${b.summary}`.toLocaleLowerCase().includes(term));}
