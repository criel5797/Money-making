'use strict';

var fs = require('fs');
var path = require('path');

var OUT = path.join(process.cwd(), 'dist');

// 절대 URL(예: https://USER.github.io/Money-making). 없으면 BASE_PATH만 사용.
var RAW_BASE_URL = (process.env.BASE_URL || '').replace(/\/+$/, '');
var BASE_URL = RAW_BASE_URL;

// BASE_PATH: 내부 링크 접두 경로. BASE_URL이 있으면 그 pathname, 없으면 /REPO 자동 계산.
var repoEnv = (process.env.GITHUB_REPOSITORY || '');
var repoName = repoEnv.split('/')[1] || '';
var autoBasePath = repoName ? '/' + repoName : '';
var BASE_PATH = BASE_URL
  ? (new URL(BASE_URL).pathname.replace(/\/$/, '') || '')
  : (process.env.BASE_PATH || autoBasePath);

var ADS_CLIENT = process.env.ADSENSE_CLIENT || ''; // 예: ca-pub-XXXXXXXX
var PUB_ID = ADS_CLIENT.replace('ca-pub-', '');

var categories = [
  { key: 'bio', name: '인스타 바이오' },
  { key: 'caption', name: '캡션 아이디어' },
  { key: 'hashtag', name: '해시태그 아이디어' }
];

var niches = [
  '피트니스 코치','카페','사진작가','부동산 중개','뷰티 살롱','스타트업','이커머스','여행 블로거',
  '개발자','마케터','요리사','영어 과외','도예 공방','꽃집','펫샵','PT 센터','디자이너','서점'
];

var adjectives = ['감성','미니멀','대담','따뜻','세련','유머','진정성','활기','담백','프리미엄'];
var hooks = ['지금 시작해요','DM 환영','오늘도 한 걸음','변화를 기록합니다','매일 성장','소소한 행복','작은 습관 큰 변화'];

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function write(p, c){ ensureDir(path.dirname(p)); fs.writeFileSync(p, c); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎ가-힣]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,''); }
function canonical(pathname){ return BASE_URL ? (BASE_URL + pathname) : (BASE_PATH + pathname); }
function href(p){ return BASE_PATH + p; }

function layout(title, pathname, body){
  var ads = ADS_CLIENT
    ? (
      '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADS_CLIENT + '" crossorigin="anonymous"></script>' +
      '<ins class="adsbygoogle" style="display:block" data-ad-format="auto" data-full-width-responsive="true"></ins>' +
      '<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>'
    )
    : '<div class="placeholder">AdSense 승인 후 광고가 표시됩니다</div>';

  var head =
    '<!doctype html><html lang="ko"><head>' +
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + title + '</title>' +
    '<meta name="description" content="' + title + ' - 바로 복사 가능한 아이디어">' +
    '<link rel="canonical" href="' + canonical(pathname) + '"/>' +
    '<meta name="robots" content="index,follow">' +
    '<style>' +
    'body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:24px;line-height:1.6}' +
    'h1{font-size:28px;margin:8px 0 12px}' +
    'a{color:#0a66c2;text-decoration:none} a:hover{text-decoration:underline}' +
    '.card{border:1px solid #eee;border-radius:8px;padding:16px;margin:16px 0}' +
    'li.item{cursor:pointer;border:1px dashed #ddd;border-radius:6px;padding:8px;margin:6px 0}' +
    'li.item:hover{background:#fafafa}' +
    'footer{color:#777;margin:32px 0}' +
    '.ad{margin:24px 0}' +
    '.placeholder{height:90px;background:#f2f2f2;border:1px dashed #ddd;display:flex;align-items:center;justify-content:center;color:#888;font-size:12px}' +
    'nav a{margin-right:12px}' +
    '</style>' +
    '</head><body>' +
    '<nav><a href="' + href('/') + '">홈</a> <a href="' + href('/topics/') + '">전체 주제</a></nav>';

  var tail =
    '<div class="ad">' + ads + '</div>' +
    '<footer>© ' + (new Date().getFullYear()) + ' Auto Text Lab</footer>' +
    '<script>function copyTxt(t){if(navigator.clipboard){navigator.clipboard.writeText(t);}alert("복사되었습니다!");}</script>' +
    '</body></html>';

  return head + body + tail;
}

function exampleLines(catKey, niche){
  var out = [];
  var i, adj, hk, base;
  var max = Math.min(40, adjectives.length * hooks.length);
  for(i = 0; i < max; i++){
    adj = adjectives[i % adjectives.length];
    hk = hooks[i % hooks.length];
    if(catKey === 'bio'){
      out.push(adj + ' ' + niche + ' | ' + hk);
    }else if(catKey === 'caption'){
      out.push(adj + ' 무드의 ' + niche + ' 일상. ' + hk);
    }else{
      base = slugify(niche).split('-').slice(0,2).join('');
      out.push('#' + base + ' #' + adj + ' #' + hk.replace(/\s/g,''));
    }
  }
  // 유니크 처리
  var seen = Object.create(null);
  var uniq = [];
  for(i = 0; i < out.length; i++){
    if(!seen[out[i]]){ seen[out[i]] = true; uniq.push(out[i]); }
  }
  return uniq;
}

function renderIndex(pages){
  var i, c, list, cats = [];
  for(i = 0; i < categories.length; i++){
    c = categories[i];
    list = '<div class="card"><h2>' + c.name + '</h2><ul>';
    var cnt = 0;
    var j;
    for(j = 0; j < pages.length; j++){
      if(pages[j].cat === c.key && cnt < 20){
        list += '<li><a href="' + href('/t/' + pages[j].slug + '/') + '">' + pages[j].title + '</a></li>';
        cnt++;
      }
    }
    list += '</ul><a href="' + href('/topics/' + c.key + '/') + '">더 보기 →</a></div>';
    cats.push(list);
  }
  var body =
    '<h1>인스타 바이오·캡션·해시태그 아이디어 생성기</h1>' +
    '<p>클릭하면 복사됩니다. 광고로 운영되는 무료 서비스입니다.</p>' +
    cats.join('');
  write(path.join(OUT, 'index.html'), layout('인스타 아이디어 생성기', '/', body));
}

function renderTopicList(catKey, pages){
  var list = '<h1>' + (categories.filter(function(c){return c.key===catKey;})[0].name) + ' 전체 목록</h1><ul>';
  var i;
  for(i = 0; i < pages.length; i++){
    if(pages[i].cat === catKey){
      list += '<li><a href="' + href('/t/' + pages[i].slug + '/') + '">' + pages[i].title + '</a></li>';
    }
  }
  list += '</ul>';
  write(path.join(OUT, 'topics', catKey, 'index.html'), layout('' + (categories.filter(function(c){return c.key===catKey;})[0].name) + ' 전체 목록', '/topics/' + catKey + '/', list));
}

function renderTopicPage(page){
  var i, items = '<h1>' + page.title + '</h1><p>아래 문구를 클릭하면 복사됩니다.</p><ul>';
  for(i = 0; i < page.examples.length; i++){
    var ex = page.examples[i].replace(/'/g, "\\'");
    items += '<li class="item" onclick="copyTxt(\'' + ex + '\')">' + page.examples[i] + '</li>';
  }
  items += '</ul>';
  var rel = '<section class="card"><h3>관련 주제</h3><ul>';
  for(i = 0; i < page.related.length; i++){
    rel += '<li><a href="' + href('/t/' + page.related[i].slug + '/') + '">' + page.related[i].title + '</a></li>';
  }
  rel += '</ul></section>';
  write(path.join(OUT, 't', page.slug, 'index.html'), layout(page.title, '/t/' + page.slug + '/', items + rel));
}

function build(){
  if(fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  var pages = [];
  var i, j, c, n, slug, title, examples;
  for(i = 0; i < categories.length; i++){
    c = categories[i];
    for(j = 0; j < niches.length; j++){
      n = niches[j];
      slug = slugify(c.key + '-' + n);
      title = c.name + ' 예시 - ' + n;
      examples = exampleLines(c.key, n);
      pages.push({ cat: c.key, slug: slug, title: title, examples: examples });
    }
  }

  for(i = 0; i < pages.length; i++){
    pages[i].related = [];
    var added = 0;
    for(j = 0; j < pages.length && added < 10; j++){
      if(pages[j].cat === pages[i].cat && pages[j].slug !== pages[i].slug){
        pages[i].related.push({ slug: pages[j].slug, title: pages[j].title });
        added++;
      }
    }
  }

  renderIndex(pages);
  for(i = 0; i < categories.length; i++) renderTopicList(categories[i].key, pages);
  for(i = 0; i < pages.length; i++) renderTopicPage(pages[i]);

  // sitemap / robots
  var urls = ['/'];
  for(i = 0; i < categories.length; i++) urls.push('/topics/' + categories[i].key + '/');
  for(i = 0; i < pages.length; i++) urls.push('/t/' + pages[i].slug + '/');

  var abs = function(p){ return BASE_URL ? (BASE_URL + p) : (BASE_PATH + p); };
  var sm = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for(i = 0; i < urls.length; i++) sm.push('<url><loc>' + abs(urls[i]) + '</loc></url>');
  sm.push('</urlset>');
  write(path.join(OUT, 'sitemap.xml'), sm.join('\n'));

  write(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + abs('/sitemap.xml'));

  if(PUB_ID){
    write(path.join(OUT, 'ads.txt'), 'google.com, ' + PUB_ID + ', DIRECT, f08c47fec0942fa0');
  }

  write(path.join(OUT, 'topics', 'index.html'), layout('전체 주제 목록', '/topics/', '<h1>전체 주제</h1><ul>' + categories.map(function(c){return '<li><a href="' + href('/topics/' + c.key + '/') + '">' + c.name + '</a></li>';}).join('') + '</ul>'));
  console.log('Generated ' + pages.length + ' pages');
}

build();