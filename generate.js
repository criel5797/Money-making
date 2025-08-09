const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'dist');

// BASE_URL: 절대 URL(예: https://criel5797.github.io/Money-making). 없으면 자동 계산된 BASE_PATH만 사용.
const RAW_BASE_URL = (process.env.BASE_URL || '').replace(//+$/, '');
const BASE_URL = RAW_BASE_URL;

// BASE_PATH: 링크용 경로 접두사. BASE_URL이 있으면 그 pathname, 없으면 GitHub Actions의 GITHUB_REPOSITORY로부터 /REPO 자동 계산.
const repoName = (process.env.GITHUB_REPOSITORY || '').split('/')[1] || '';
const autoBasePath = repoName ? /${repoName} : '';
const BASE_PATH = BASE_URL
? new URL(BASE_URL).pathname.replace(//$/, '')
: (process.env.BASE_PATH || autoBasePath);

const ADS_CLIENT = process.env.ADSENSE_CLIENT || ''; // e.g. ca-pub-XXXX
const PUB_ID = ADS_CLIENT.replace('ca-', ''); // ads.txt용

const categories = [
{ key: 'bio', name: '인스타 바이오' },
{ key: 'caption', name: '캡션 아이디어' },
{ key: 'hashtag', name: '해시태그 아이디어' }
];

const niches = [
'피트니스 코치','카페','사진작가','부동산 중개','뷰티 살롱','스타트업','이커머스','여행 블로거',
'개발자','마케터','요리사','영어 과외','도예 공방','꽃집','펫샵','PT 센터','디자이너','서점'
];

const adjectives = ['감성','미니멀','대담','따뜻','세련','유머','진정성','활기','담백','프리미엄'];
const hooks = ['지금 시작해요','DM 환영','오늘도 한 걸음','변화를 기록합니다','매일 성장','소소한 행복','작은 습관 큰 변화'];

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function write(p,c){ ensureDir(path.dirname(p)); fs.writeFileSync(p,c); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎ가-힣]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,''); }
function canonical(pathname){ return BASE_URL ? ${BASE_URL}${pathname} : ${BASE_PATH}${pathname}; }
function href(p){ return ${BASE_PATH}${p}; } // 내부 링크 전용

function layout(title, pathname, body){
const ads = ADS_CLIENT ? `

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}" crossorigin="anonymous"></script>
<ins class="adsbygoogle" style="display:block" data-ad-format="auto" data-full-width-responsive="true"></ins>

<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>` : '';
return `<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">

<title>${title}</title> <meta name="description" content="${title} - 바로 복사 가능한 아이디어"> <link rel="canonical" href="${canonical(pathname)}"/> <meta name="robots" content="index,follow"> <style> body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:24px;line-height:1.6} h1{font-size:28px;margin:8px 0 12px} a{color:#0a66c2;text-decoration:none} a:hover{text-decoration:underline} .card{border:1px solid #eee;border-radius:8px;padding:16px;margin:16px 0} li.item{cursor:pointer;border:1px dashed #ddd;border-radius:6px;padding:8px;margin:6px 0} li.item:hover{background:#fafafa} footer{color:#777;margin:32px 0} .ad{margin:24px 0} .placeholder{height:90px;background:#f2f2f2;border:1px dashed #ddd;display:flex;align-items:center;justify-content:center;color:#888;font-size:12px} </style> </head><body> ${body} <div class="ad">${ads || '<div class="placeholder">AdSense 승인 후 광고가 표시됩니다</div>'}</div> <footer>© ${new Date().getFullYear()} Auto Text Lab</footer> <script> function copyTxt(t){navigator.clipboard&&navigator.clipboard.writeText(t);alert('복사되었습니다!');} </script> </body></html>`; }
function exampleLines(catKey, niche){
const out = [];
for(let i=0;i<Math.min(40, adjectives.length*hooks.length);i++){
const adj = adjectives[i % adjectives.length];
const hk = hooks[i % hooks.length];
if(catKey==='bio'){
out.push(${adj} ${niche} | ${hk});
}else if(catKey==='caption'){
out.push(${adj} 무드의 ${niche} 일상. ${hk});
}else{
const base = slugify(niche).split('-').slice(0,2).join('');
out.push(#${base} #${adj} #${hk.replace(/\s/g,'')});
}
}
return Array.from(new Set(out));
}

function renderIndex(pages){
const cats = categories.map(c=><div class="card"><h2>${c.name}</h2><ul>+
pages.filter(p=>p.cat===c.key).slice(0,20).map(p=><li><a href="${href(/t/${p.slug}/)}">${p.title}</a></li>).join('')+
</ul><a href="${href(/topics/${c.key}/)}">더 보기 →</a></div>).join('');
const body = `<h1>인스타 바이오·캡션·해시태그 아이디어 생성기</h1>

<p>클릭하면 복사됩니다. 광고로 운영되는 무료 서비스입니다.</p>${cats}`; write(path.join(OUT,'index.html'), layout('인스타 아이디어 생성기','/', body)); }
function renderTopicList(catKey, pages){
const list = pages.filter(p=>p.cat===catKey).map(p=><li><a href="${href(/t/${p.slug}/)}">${p.title}</a></li>).join('');
const catName = categories.find(c=>c.key===catKey).name;
write(path.join(OUT,'topics',catKey,'index.html'), layout(${catName} 전체 목록, /topics/${catKey}/, <h1>${catName} 전체 목록</h1><ul>${list}</ul>));
}

function renderTopicPage(page){
const items = page.examples.map(e=><li class="item" onclick="copyTxt('${e.replace(/'/g,"\\'")}')">${e}</li>).join('');
const related = page.related.map(r=><li><a href="${href(/t/${r.slug}/)}">${r.title}</a></li>).join('');
const body = `<h1>${page.title}</h1><p>아래 문구를 클릭하면 복사됩니다.</p><ul>${items}</ul>

<section class="card"><h3>관련 주제</h3><ul>${related}</ul></section>`; write(path.join(OUT,'t',page.slug,'index.html'), layout(page.title, `/t/${page.slug}/`, body)); }
function build(){
if(fs.existsSync(OUT)) fs.rmSync(OUT,{recursive:true,force:true});
ensureDir(OUT);

const pages = [];
for(const c of categories){
for(const n of niches){
const slug = slugify(${c.key}-${n});
const title = ${c.name} 예시 - ${n};
const examples = exampleLines(c.key, n);
pages.push({ cat:c.key, slug, title, examples });
}
}
for(const p of pages){
p.related = pages.filter(o=>o.cat===p.cat && o.slug!==p.slug).slice(0,10);
}

renderIndex(pages);
for(const c of categories) renderTopicList(c.key, pages);
for(const p of pages) renderTopicPage(p);

// sitemap/robots (BASE_URL 없으면 상대경로 대신 BASE_PATH 기반으로 절대 경로가 안 되니, AdSense/검색 제출 전 BASE_URL만 채우면 자동 보정됩니다)
const abs = (p)=> BASE_URL ? ${BASE_URL}${p} : ${BASE_PATH}${p};
const urls = [/, ...categories.map(c=>/topics/${c.key}/), ...pages.map(p=>/t/${p.slug}/)];
write(path.join(OUT,'sitemap.xml'),
<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=><url><loc>${abs(u)}</loc></url>).join('\n')}\n</urlset>);
write(path.join(OUT,'robots.txt'), User-agent: *\nAllow: /\nSitemap: ${abs('/sitemap.xml')});

if(PUB_ID){
write(path.join(OUT,'ads.txt'), google.com, ${PUB_ID}, DIRECT, f08c47fec0942fa0);
}

write(path.join(OUT,'topics','index.html'), layout('전체 주제 목록','/topics/', <h1>전체 주제</h1><ul>${categories.map(c=><li><a href="${href(`/topics/${c.key}/`)}">${c.name}</a></li>).join('')}</ul>));
console.log(Generated ${pages.length} pages);
}