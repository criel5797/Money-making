'use strict';

module.exports = {
  // ... (previous 24 tools)
  // I will write the full file content to ensure validity.

  'age-calculator': {
    meta: { title: { ko: '나이 계산기', en: 'Age Calculator', ja: '年齢計算機' }, desc: { ko: '만 나이 계산', en: 'Calculate Age', ja: '満年齢計算' } },
    header: { title: { ko: '🎂 나이 계산기', en: '🎂 Age Calculator', ja: '🎂 年齢計算機' }, subtitle: { ko: '만 나이 확인', en: 'Check Age', ja: '年齢確認' } },
    input: { label: { ko: '생년월일', en: 'Birth Date', ja: '生年月日' }, btn: { ko: '계산하기', en: 'Calculate', ja: '計算' } },
    result: { intAge: { ko: '만 나이', en: 'Int. Age', ja: '満年齢' }, korAge: { ko: '한국 나이', en: 'Korean Age', ja: '韓国年齢' }, nextBirth: { ko: '다음 생일', en: 'Next Birthday', ja: '次の誕生日' }, daysLeft: { ko: '일 남음', en: 'days left', ja: '日残り' }, zodiac: { ko: '띠', en: 'Zodiac', ja: '干支' }, constellation: { ko: '별자리', en: 'Sign', ja: '星座' }, dayOfWeek: { ko: '요일', en: 'Day', ja: '曜日' }, daysLived: { ko: '살아온 날', en: 'Days Lived', ja: '生きた日数' } },
    info: { title: { ko: '📌 정보', en: '📌 Info', ja: '📌 情報' }, desc: { ko: '만 나이 기준입니다.', en: 'Based on Int. Age.', ja: '満年齢基準です。' } },
    share: { ko: '공유', en: 'Share', ja: '共有' }, disclaimer: { ko: '참고용입니다.', en: 'Reference only.', ja: '参考用です。' }
  },
  'json-formatter': {
    meta: { title: { ko: 'JSON 포맷터', en: 'JSON Formatter', ja: 'JSONフォーマッター' }, desc: { ko: 'JSON 정렬', en: 'Format JSON', ja: 'JSON整形' } },
    header: { title: { ko: 'JSON 포맷터', en: 'JSON Formatter', ja: 'JSONフォーマッター' }, subtitle: { ko: 'JSON 정렬 도구', en: 'JSON Tool', ja: 'JSONツール' } },
    options: { indent: { ko: '들여쓰기', en: 'Indent', ja: 'インデント' }, view: { ko: '보기', en: 'View', ja: '表示' } },
    controls: { format: { ko: '정렬', en: 'Format', ja: '整形' }, minify: { ko: '압축', en: 'Minify', ja: '圧縮' }, validate: { ko: '검증', en: 'Validate', ja: '検証' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, sample: { ko: '샘플', en: 'Sample', ja: 'サンプル' } },
    panel: { input: { ko: '입력', en: 'Input', ja: '入力' }, paste: { ko: '붙여넣기', en: 'Paste', ja: '貼付' }, placeholder: { ko: 'JSON 입력...', en: 'Enter JSON...', ja: 'JSON入力...' }, output: { ko: '출력', en: 'Output', ja: '出力' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, download: { ko: '다운로드', en: 'Download', ja: 'DL' }, ready: { ko: '준비됨', en: 'Ready', ja: '準備完了' } },
    features: { f1: { title: { ko: '정렬', en: 'Format', ja: '整形' }, desc: { ko: '보기 좋게', en: 'Pretty', ja: '綺麗に' } }, f2: { title: { ko: '검증', en: 'Validate', ja: '検証' }, desc: { ko: '오류 확인', en: 'Check', ja: '確認' } }, f3: { title: { ko: '강조', en: 'Highlight', ja: '強調' }, desc: { ko: '색상', en: 'Color', ja: '色' } }, f4: { title: { ko: '압축', en: 'Minify', ja: '圧縮' }, desc: { ko: '작게', en: 'Compact', ja: '小さく' } } },
    footer: { ko: '안전한 도구', en: 'Secure Tool', ja: '安全なツール' }
  },
  'daily-fortune': {
    meta: { title: { ko: '오늘의 운세', en: 'Daily Fortune', ja: '今日の運勢' }, desc: { ko: 'AI 운세', en: 'AI Fortune', ja: 'AI運勢' } },
    header: { title: { ko: '오늘의 운세', en: 'Daily Fortune', ja: '今日の運勢' }, subtitle: { ko: 'AI 분석', en: 'AI Analysis', ja: 'AI分析' } },
    tabs: { zodiac: { ko: '별자리', en: 'Zodiac', ja: '星座' }, chinese: { ko: '띠', en: 'Sign', ja: '干支' }, blood: { ko: '혈액형', en: 'Blood Type', ja: '血液型' } },
    ui: { selectType: { ko: '유형 선택', en: 'Select Type', ja: 'タイプ選択' }, generate: { ko: '운세 보기', en: 'View Fortune', ja: '運勢を見る' }, loading: { ko: '분석 중...', en: 'Analyzing...', ja: '分析中...' }, overall: { ko: '총운', en: 'Overall', ja: '総運' }, mainTitle: { ko: '상세 풀이', en: 'Details', ja: '詳細' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, share: { ko: '공유', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Retry', ja: 'もう一度' } },
    categories: { love: { ko: '애정운', en: 'Love', ja: '恋愛' }, money: { ko: '금전운', en: 'Money', ja: '金運' }, work: { ko: '직장운', en: 'Work', ja: '仕事' }, health: { ko: '건강운', en: 'Health', ja: '健康' } },
    advice: { number: { ko: '행운의 숫자', en: 'Lucky Num', ja: 'ラッキー数' }, color: { ko: '행운의 색', en: 'Lucky Color', ja: 'ラッキー色' }, direction: { ko: '행운의 방향', en: 'Direction', ja: '方向' }, tip: { ko: '조언', en: 'Tip', ja: '助言' } }
  },
  'mbti-test': {
    meta: { title: { ko: 'MBTI 테스트', en: 'MBTI Test', ja: 'MBTIテスト' }, desc: { ko: '성격 유형 검사', en: 'Personality Test', ja: '性格検査' } },
    ui: { title: { ko: 'MBTI 테스트', en: 'MBTI Test', ja: 'MBTIテスト' }, subtitle: { ko: '12문항 약식 검사', en: '12 Questions', ja: '12問検査' }, introTitle: { ko: '나의 MBTI는?', en: 'My MBTI?', ja: '私のMBTIは？' }, startBtn: { ko: '시작하기', en: 'Start', ja: '開始' }, nextBtn: { ko: '다음', en: 'Next', ja: '次へ' }, resultBtn: { ko: '결과 보기', en: 'Result', ja: '結果' }, yourType: { ko: '당신의 유형:', en: 'Your Type:', ja: 'あなたのタイプ:' }, share: { ko: '공유', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Retry', ja: '再テスト' } }
  },
  'password-generator': {
    meta: { title: { ko: '비밀번호 생성기', en: 'Password Gen', ja: 'パスワード生成' }, desc: { ko: '안전한 비밀번호', en: 'Secure PW', ja: '安全なPW' } },
    header: { title: { ko: '🔐 비밀번호 생성기', en: '🔐 Password Generator', ja: '🔐 パスワード生成' }, subtitle: { ko: '강력한 비밀번호 생성', en: 'Create strong passwords', ja: '強力なパスワード生成' } },
    display: { placeholder: { ko: '생성 버튼 클릭', en: 'Click Generate', ja: '生成ボタンをクリック' } },
    strength: { label: { ko: '강도:', en: 'Strength:', ja: '強度:' }, weak: { ko: '약함', en: 'Weak', ja: '弱い' }, medium: { ko: '보통', en: 'Medium', ja: '普通' }, strong: { ko: '강함', en: 'Strong', ja: '強い' }, veryStrong: { ko: '매우 강함', en: 'Very Strong', ja: '非常に強い' } },
    options: { length: { title: { ko: '길이', en: 'Length', ja: '長さ' }, desc: { ko: '길수록 안전', en: 'Longer is safer', ja: '長いほど安全' } }, uppercase: { title: { ko: '대문자', en: 'Uppercase', ja: '大文字' }, desc: { ko: 'A-Z', en: 'A-Z', ja: 'A-Z' } }, lowercase: { title: { ko: '소문자', en: 'Lowercase', ja: '小文字' }, desc: { ko: 'a-z', en: 'a-z', ja: 'a-z' } }, numbers: { title: { ko: '숫자', en: 'Numbers', ja: '数字' }, desc: { ko: '0-9', en: '0-9', ja: '0-9' } }, symbols: { title: { ko: '특수문자', en: 'Symbols', ja: '記号' }, desc: { ko: '!@#', en: '!@#', ja: '!@#' } }, exclude: { title: { ko: '모호한 문자 제외', en: 'No Ambiguous', ja: '曖昧除外' }, desc: { ko: 'I, 1, O, 0', en: 'I, 1, O, 0', ja: 'I, 1, O, 0' } } },
    generateBtn: { ko: '🎲 생성하기', en: '🎲 Generate', ja: '🎲 生成' },
    history: { title: { ko: '📜 기록', en: '📜 History', ja: '📜 履歴' }, clear: { ko: '삭제', en: 'Clear', ja: '削除' }, empty: { ko: '기록 없음', en: 'No history', ja: '履歴なし' } },
    info: { tips: { ko: '팁', en: 'Tips', ja: 'ヒント' }, secure: { title: { ko: '안전성', en: 'Security', ja: '安全性' }, desc: { ko: '100% 로컬 처리', en: '100% Local', ja: '100%ローカル' } } },
    footer: { ko: '안전 최우선', en: 'Security First', ja: '安全第一' }
  },
  'qr-generator': {
    meta: { title: { ko: 'QR 생성기', en: 'QR Generator', ja: 'QR生成' }, desc: { ko: 'QR 코드 생성', en: 'Create QR', ja: 'QR作成' } },
    header: { title: { ko: 'QR 코드 생성기', en: 'QR Generator', ja: 'QRコード生成' }, subtitle: { ko: '다양한 QR 생성', en: 'Create various QR', ja: '様々なQR生成' } },
    tabs: { url: { ko: 'URL', en: 'URL', ja: 'URL' }, text: { ko: '텍스트', en: 'Text', ja: 'テキスト' }, wifi: { ko: '와이파이', en: 'WiFi', ja: 'Wi-Fi' }, email: { ko: '이메일', en: 'Email', ja: 'メール' }, phone: { ko: '전화', en: 'Phone', ja: '電話' } },
    inputs: { urlLabel: { ko: 'URL', en: 'URL', ja: 'URL' }, textLabel: { ko: '내용', en: 'Content', ja: '内容' }, ssid: { ko: 'SSID', en: 'SSID', ja: 'SSID' }, password: { ko: '비밀번호', en: 'Password', ja: 'パスワード' }, security: { ko: '보안', en: 'Security', ja: 'セキュリティ' }, emailAddr: { ko: '주소', en: 'Address', ja: 'アドレス' }, subject: { ko: '제목', en: 'Subject', ja: '件名' }, body: { ko: '내용', en: 'Body', ja: '本文' }, phone: { ko: '번호', en: 'Number', ja: '番号' } },
    customize: { title: { ko: '⚙️ 설정', en: '⚙️ Settings', ja: '⚙️ 設定' }, qrColor: { ko: 'QR 색상', en: 'Color', ja: '色' }, bgColor: { ko: '배경', en: 'BG', ja: '背景' }, size: { ko: '크기', en: 'Size', ja: 'サイズ' } },
    generateBtn: { ko: '✨ 생성하기', en: '✨ Generate', ja: '✨ 生成' },
    preview: { title: { ko: '📱 미리보기', en: '📱 Preview', ja: '📱 プレビュー' } },
    download: { png: { ko: '💾 PNG', en: '💾 PNG', ja: '💾 PNG' }, svg: { ko: '📄 SVG', en: '📄 SVG', ja: '📄 SVG' } },
    info: { title: { ko: '활용', en: 'Usage', ja: '活用' } },
    footer: { ko: '유용하게', en: 'Enjoy', ja: '便利に' }
  },
  'lorem-ipsum': {
    meta: { title: { ko: '로렘 입숨', en: 'Lorem Ipsum', ja: 'Lorem Ipsum' }, desc: { ko: '더미 텍스트', en: 'Dummy Text', ja: 'ダミーテキスト' } },
    header: { title: { ko: '로렘 입숨 생성기', en: 'Lorem Ipsum Gen', ja: 'Lorem Ipsum生成' }, subtitle: { ko: '더미 텍스트 생성', en: 'Dummy Text Gen', ja: 'ダミーテキスト生成' } },
    presets: { title: { ko: '⚡ 프리셋', en: '⚡ Presets', ja: '⚡ プリセット' }, p1: { name: { ko: '1 문단', en: '1 Para', ja: '1段落' }, desc: { ko: '간단히', en: 'Simple', ja: '簡単' } }, p3: { name: { ko: '3 문단', en: '3 Paras', ja: '3段落' }, desc: { ko: '보통', en: 'Normal', ja: '普通' } }, p5: { name: { ko: '5 문단', en: '5 Paras', ja: '5段落' }, desc: { ko: '많이', en: 'Many', ja: '多く' } }, w100: { name: { ko: '100 단어', en: '100 Words', ja: '100単語' }, desc: { ko: '짧게', en: 'Short', ja: '短く' } }, w500: { name: { ko: '500 단어', en: '500 Words', ja: '500単語' }, desc: { ko: '길게', en: 'Long', ja: '長く' } }, s10: { name: { ko: '10 문장', en: '10 Sentences', ja: '10文' }, desc: { ko: '목록', en: 'List', ja: 'リスト' } } },
    controls: { type: { label: { ko: '단위', en: 'Unit', ja: '単位' }, para: { ko: '문단', en: 'Paras', ja: '段落' }, sent: { ko: '문장', en: 'Sentences', ja: '文' }, word: { ko: '단어', en: 'Words', ja: '単語' } }, amount: { label: { ko: '수량', en: 'Amount', ja: '数量' } }, style: { label: { ko: '스타일', en: 'Style', ja: 'スタイル' }, classic: { ko: '기본', en: 'Classic', ja: '基本' }, hipster: { ko: '힙스터', en: 'Hipster', ja: 'ヒップスター' }, corporate: { ko: '비즈니스', en: 'Corporate', ja: 'ビジネス' } }, startLorem: { label: { ko: 'Lorem ipsum 시작', en: 'Start Lorem', ja: 'Lorem開始' } }, html: { label: { ko: '<p> 태그', en: '<p> Tags', ja: '<p>タグ' } }, generate: { ko: '✨ 생성', en: '✨ Generate', ja: '✨ 生成' } },
    output: { info: { ko: '생성하세요...', en: 'Generate...', ja: '生成...' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, download: { ko: '다운로드', en: 'Download', ja: 'DL' } },
    info: { title: { ko: '정보', en: 'Info', ja: '情報' } },
    footer: { ko: '디자이너용', en: 'For Designers', ja: 'デザイナー用' }
  },
  'color-converter': {
    meta: { title: { ko: '색상 변환기', en: 'Color Converter', ja: 'カラーコンバーター' }, desc: { ko: '색상 변환', en: 'Color Convert', ja: '色変換' } },
    header: { title: { ko: '색상 변환기', en: 'Color Converter', ja: 'カラーコンバーター' }, subtitle: { ko: '색상 코드 변환', en: 'Convert Codes', ja: 'コード変換' } },
    preview: { desc: { ko: '선택 또는 입력', en: 'Pick or Enter', ja: '選択または入力' }, random: { ko: '🎲 랜덤', en: '🎲 Random', ja: '🎲 ランダム' } },
    formats: { copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    palette: { title: { ko: '🎨 팔레트', en: '🎨 Palette', ja: '🎨 パレット' } },
    saved: { title: { ko: '💾 저장됨', en: '💾 Saved', ja: '💾 保存済み' }, save: { ko: '저장', en: 'Save', ja: '保存' }, clear: { ko: '삭제', en: 'Clear', ja: '削除' }, empty: { ko: '없음', en: 'Empty', ja: 'なし' } },
    footer: { ko: '편리한 도구', en: 'Useful Tool', ja: '便利なツール' }
  },
  'base64-tool': {
    meta: { title: { ko: 'Base64 변환기', en: 'Base64 Tool', ja: 'Base64ツール' }, desc: { ko: 'Base64 인코딩/디코딩', en: 'Base64 Encode/Decode', ja: 'Base64エンコード/デコード' } },
    header: { title: { ko: 'Base64 변환기', en: 'Base64 Converter', ja: 'Base64変換器' }, subtitle: { ko: '텍스트 ↔ Base64', en: 'Text ↔ Base64', ja: 'テキスト ↔ Base64' } },
    mode: { encode: { ko: '인코딩', en: 'Encode', ja: 'エンコード' }, decode: { ko: '디코딩', en: 'Decode', ja: 'デコード' } },
    input: { labelEnc: { ko: '평문', en: 'Plain Text', ja: '平文' }, labelDec: { ko: 'Base64', en: 'Base64', ja: 'Base64' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, placeholderEnc: { ko: '텍스트 입력...', en: 'Enter text...', ja: 'テキスト入力...' }, placeholderDec: { ko: 'Base64 입력...', en: 'Enter Base64...', ja: 'Base64入力...' } },
    output: { labelEnc: { ko: 'Base64 결과', en: 'Base64 Result', ja: 'Base64結果' }, labelDec: { ko: '평문 결과', en: 'Text Result', ja: '平文結果' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, placeholder: { ko: '결과...', en: 'Result...', ja: '結果...' } },
    btn: { convert: { ko: '변환하기', en: 'Convert', ja: '変換' } },
    features: { t1: { ko: '즉시 변환', en: 'Instant', ja: '即時' }, d1: { ko: '빠름', en: 'Fast', ja: '高速' }, t2: { ko: '보안', en: 'Secure', ja: '安全' }, d2: { ko: '로컬 처리', en: 'Local', ja: 'ローカル' } },
    info: { title: { ko: 'Base64란?', en: 'About Base64', ja: 'Base64とは？' } }
  },
  'uuid-generator': {
    meta: { title: { ko: 'UUID 생성기', en: 'UUID Generator', ja: 'UUID生成器' }, desc: { ko: 'UUID 생성', en: 'Generate UUID', ja: 'UUID生成' } },
    header: { title: { ko: 'UUID 생성기', en: 'UUID Generator', ja: 'UUID生成器' }, subtitle: { ko: '고유 식별자 생성', en: 'Generate Unique IDs', ja: '一意識別子生成' } },
    display: { placeholder: { ko: '생성 클릭', en: 'Click Generate', ja: '生成クリック' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    options: {
      version: { label: { ko: '버전:', en: 'Version:', ja: 'バージョン:' }, v4: { ko: 'v4 (랜덤)', en: 'v4 (Random)', ja: 'v4 (ランダム)' }, v1: { ko: 'v1 (시간)', en: 'v1 (Time)', ja: 'v1 (時間)' } },
      count: { label: { ko: '개수:', en: 'Count:', ja: '個数:' } },
      opts: { upper: { ko: '대문자', en: 'Uppercase', ja: '大文字' }, nodash: { ko: '하이픈 제외', en: 'No Dashes', ja: 'ハイフンなし' }, braces: { ko: '중괄호 {}', en: 'Braces {}', ja: '中括弧 {}' } }
    },
    generate: { ko: '🎲 생성하기', en: '🎲 Generate', ja: '🎲 生成' },
    bulk: { title: { ko: '목록', en: 'List', ja: 'リスト' }, copyAll: { ko: '전체 복사', en: 'Copy All', ja: '全コピー' }, download: { ko: '다운로드', en: 'Download', ja: 'DL' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } },
    info: { title: { ko: 'UUID란?', en: 'What is UUID?', ja: 'UUIDとは？' } }
  },
  'hash-generator': {
    meta: { title: { ko: '해시 생성기', en: 'Hash Generator', ja: 'ハッシュ生成' }, desc: { ko: 'MD5, SHA 해시', en: 'MD5, SHA Hash', ja: 'MD5, SHAハッシュ' } },
    header: { title: { ko: '해시 생성기', en: 'Hash Generator', ja: 'ハッシュ生成' }, subtitle: { ko: '해시 알고리즘', en: 'Hash Algorithms', ja: 'ハッシュアルゴリズム' } },
    input: { label: { ko: '입력:', en: 'Input:', ja: '入力:' }, placeholder: { ko: '텍스트 입력...', en: 'Enter text...', ja: 'テキスト入力...' } },
    options: { upper: { ko: '대문자 출력', en: 'Uppercase', ja: '大文字' } },
    generate: { ko: '생성하기', en: 'Generate', ja: '生成' },
    results: { copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    compare: { title: { ko: '비교', en: 'Compare', ja: '比較' }, p1: { ko: '해시 1', en: 'Hash 1', ja: 'ハッシュ1' }, p2: { ko: '해시 2', en: 'Hash 2', ja: 'ハッシュ2' }, wait: { ko: '비교 대기...', en: 'Waiting...', ja: '待機中...' }, match: { ko: '일치!', en: 'Match!', ja: '一致!' }, diff: { ko: '불일치', en: 'No Match', ja: '不一致' } },
    info: { title: { ko: '해시 함수', en: 'Hash Function', ja: 'ハッシュ関数' } }
  },
  'url-encoder': {
    meta: { title: { ko: 'URL 인코더', en: 'URL Encoder', ja: 'URLエンコーダー' }, desc: { ko: 'URL 변환', en: 'URL Convert', ja: 'URL変換' } },
    header: { title: { ko: 'URL 인코더/디코더', en: 'URL Encoder/Decoder', ja: 'URLエンコーダー/デコーダー' }, subtitle: { ko: 'URL 변환 도구', en: 'URL Tool', ja: 'URLツール' } },
    mode: { encode: { ko: '인코딩', en: 'Encode', ja: 'エンコード' }, decode: { ko: '디코딩', en: 'Decode', ja: 'デコード' } },
    input: { labelEnc: { ko: '변환할 텍스트', en: 'Text', ja: 'テキスト' }, labelDec: { ko: '변환할 URL', en: 'URL', ja: 'URL' }, placeholderEnc: { ko: '입력...', en: 'Enter...', ja: '入力...' }, placeholderDec: { ko: 'URL 입력...', en: 'Enter URL...', ja: 'URL入力...' } },
    options: { all: { ko: '전체 인코딩', en: 'Encode All', ja: '全エンコード' }, plus: { ko: '공백 +', en: 'Space +', ja: '空白 +' } },
    action: { encode: { ko: '인코딩', en: 'Encode', ja: 'エンコード' }, decode: { ko: '디코딩', en: 'Decode', ja: 'デコード' } },
    swap: { ko: '↕️ 교체', en: '↕️ Swap', ja: '↕️ 入替' },
    output: { labelEnc: { ko: '결과', en: 'Result', ja: '結果' }, labelDec: { ko: '결과', en: 'Result', ja: '結果' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } },
    examples: { title: { ko: '예제', en: 'Examples', ja: '例' } },
    info: { title: { ko: '정보', en: 'Info', ja: '情報' } }
  },
  'timestamp-converter': {
    meta: { title: { ko: '타임스탬프 변환기', en: 'Timestamp Converter', ja: 'タイムスタンプ変換' }, desc: { ko: 'Unix 타임스탬프 변환', en: 'Unix Timestamp Conversion', ja: 'Unixタイムスタンプ変換' } },
    header: { title: { ko: '타임스탬프 변환기', en: 'Timestamp Converter', ja: 'タイムスタンプ変換' }, subtitle: { ko: 'Unix 시간 ↔ 날짜 변환', en: 'Unix Time ↔ Date', ja: 'Unix時間 ↔ 日付' } },
    current: { label: { ko: '현재 타임스탬프', en: 'Current Timestamp', ja: '現在のタイムスタンプ' } },
    tsToDate: { title: { ko: '타임스탬프 → 날짜', en: 'Timestamp → Date', ja: 'タイムスタンプ → 日付' }, label: { ko: '타임스탬프', en: 'Timestamp', ja: 'タイムスタンプ' }, format: { ko: '형식', en: 'Format', ja: '形式' }, btn: { ko: '변환하기', en: 'Convert', ja: '変換' } },
    dateToTs: { title: { ko: '날짜 → 타임스탬프', en: 'Date → Timestamp', ja: '日付 → タイムスタンプ' }, label: { ko: '날짜 및 시간', en: 'Date & Time', ja: '日時' }, outFormat: { ko: '출력 형식', en: 'Output Format', ja: '出力形式' }, btn: { ko: '변환하기', en: 'Convert', ja: '変換' } },
    results: { local: { ko: '로컬 시간', en: 'Local Time', ja: '現地時間' }, utc: { ko: 'UTC 시간', en: 'UTC Time', ja: 'UTC時間' }, iso: { ko: 'ISO 8601', en: 'ISO 8601', ja: 'ISO 8601' }, ts: { ko: 'Unix 타임스탬프', en: 'Unix Timestamp', ja: 'Unixタイムスタンプ' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    ref: { title: { ko: '빠른 참조', en: 'Quick Reference', ja: 'クイックリファレンス' } },
    info: { title: { ko: '타임스탬프란?', en: 'What is Timestamp?', ja: 'タイムスタンプとは？' } }
  },
  'markdown-to-html': {
    meta: { title: { ko: '마크다운 변환기', en: 'Markdown Converter', ja: 'Markdown変換' }, desc: { ko: '마크다운 → HTML', en: 'Markdown → HTML', ja: 'Markdown → HTML' } },
    header: { title: { ko: '마크다운 → HTML', en: 'Markdown to HTML', ja: 'Markdown → HTML' }, subtitle: { ko: '실시간 변환 도구', en: 'Live Converter', ja: 'リアルタイム変換' } },
    input: { title: { ko: '마크다운 입력', en: 'Markdown Input', ja: 'Markdown入力' }, placeholder: { ko: '여기에 마크다운을 입력하세요...', en: 'Type Markdown here...', ja: 'ここにMarkdownを入力...' }, sample: { ko: '샘플', en: 'Sample', ja: 'サンプル' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } },
    output: { tabs: { preview: { ko: '미리보기', en: 'Preview', ja: 'プレビュー' }, code: { ko: 'HTML 코드', en: 'HTML Code', ja: 'HTMLコード' } }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, download: { ko: '다운로드', en: 'Download', ja: 'DL' } },
    cheatsheet: { title: { ko: '치트시트', en: 'Cheatsheet', ja: 'チートシート' } },
    info: { title: { ko: '마크다운이란?', en: 'About Markdown', ja: 'Markdownとは？' } }
  },
  'image-to-base64': {
    meta: { title: { ko: '이미지 Base64 변환', en: 'Image to Base64', ja: '画像Base64変換' }, desc: { ko: '이미지를 Base64 코드로 변환', en: 'Convert Image to Base64', ja: '画像をBase64に変換' } },
    header: { title: { ko: '이미지 Base64 변환', en: 'Image to Base64', ja: '画像Base64変換' }, subtitle: { ko: '이미지를 문자열로 변환하세요', en: 'Convert image to string', ja: '画像を文字列に変換' } },
    upload: { text: { ko: '이미지를 드래그하거나 클릭하세요', en: 'Drag & Drop or Click', ja: 'ドラッグ＆ドロップまたはクリック' }, hint: { ko: '지원: JPG, PNG, GIF, SVG...', en: 'Supports: JPG, PNG...', ja: '対応: JPG, PNG...' }, btn: { ko: '이미지 선택', en: 'Select Image', ja: '画像選択' } },
    preview: { title: { ko: '미리보기', en: 'Preview', ja: 'プレビュー' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, info: { name: { ko: '파일 이름', en: 'Name', ja: 'ファイル名' }, type: { ko: '파일 유형', en: 'Type', ja: 'タイプ' }, size: { ko: '원본 크기', en: 'Size', ja: 'サイズ' }, dim: { ko: '해상도', en: 'Dimensions', ja: '解像度' }, b64size: { ko: 'Base64 크기', en: 'Base64 Size', ja: 'Base64サイズ' } } },
    output: { label: { uri: { ko: 'Data URI (사용 가능)', en: 'Data URI', ja: 'Data URI' }, raw: { ko: 'Base64 문자열', en: 'Base64 String', ja: 'Base64文字列' }, html: { ko: 'HTML 태그', en: 'HTML Tag', ja: 'HTMLタグ' }, css: { ko: 'CSS 배경', en: 'CSS Background', ja: 'CSS背景' } }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, copyAll: { ko: '전체 복사', en: 'Copy All', ja: '全コピー' } },
    info: { title: { ko: 'Base64 이미지란?', en: 'About Base64 Image', ja: 'Base64画像とは？' } }
  },
  'binary-hex': {
    meta: { title: { ko: '진법 변환기', en: 'Number System Converter', ja: '進数変換器' }, desc: { ko: '2진수, 10진수, 16진수 변환', en: 'Binary, Decimal, Hex', ja: '2進数、10進数、16進数' } },
    header: { title: { ko: '진법 변환기', en: 'Number System Converter', ja: '進数変換器' }, subtitle: { ko: '숫자 시스템을 변환하세요', en: 'Convert number systems', ja: '数システムを変換' } },
    converter: { title: { ko: '숫자 변환', en: 'Number Converter', ja: '数値変換' }, dec: { ko: '10진수', en: 'Decimal', ja: '10進数' }, bin: { ko: '2진수', en: 'Binary', ja: '2進数' }, hex: { ko: '16진수', en: 'Hexadecimal', ja: '16進数' }, oct: { ko: '8진수', en: 'Octal', ja: '8進数' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    bit: { title: { ko: '비트 표현 (8비트 그룹)', en: 'Binary Representation', ja: 'ビット表現' } },
    text: { title: { ko: '텍스트 ↔ 진법 변환', en: 'Text ↔ Number', ja: 'テキスト ↔ 数値' }, input: { ko: '텍스트', en: 'Text', ja: 'テキスト' }, output: { ko: '결과', en: 'Result', ja: '結果' }, btns: { t2b: { ko: '텍스트→2진수', en: 'Text→Bin', ja: 'テキスト→2進' }, t2h: { ko: '텍스트→16진수', en: 'Text→Hex', ja: 'テキスト→16進' }, b2t: { ko: '2진수→텍스트', en: 'Bin→Text', ja: '2進→テキスト' }, h2t: { ko: '16진수→텍스트', en: 'Hex→Text', ja: '16進→テキスト' } }, copyRes: { ko: '결과 복사', en: 'Copy Result', ja: '結果コピー' } },
    features: { title: { ko: '기능', en: 'Features', ja: '機能' } },
    footer: { ko: '편리한 도구', en: 'Useful Tool', ja: '便利なツール' }
  },
  'css-minifier': {
    meta: { title: { ko: 'CSS 압축기', en: 'CSS Minifier', ja: 'CSS圧縮機' }, desc: { ko: 'CSS 파일 압축', en: 'Minify CSS', ja: 'CSS圧縮' } },
    header: { title: { ko: 'CSS 압축기', en: 'CSS Minifier', ja: 'CSS圧縮機' }, subtitle: { ko: 'CSS 파일을 압축하여 크기를 줄이세요', en: 'Compress CSS files', ja: 'CSSファイルを圧縮してサイズを縮小' } },
    stats: { original: { ko: '원본', en: 'Original', ja: '元' }, minified: { ko: '압축됨', en: 'Minified', ja: '圧縮後' }, savings: { ko: '절약', en: 'Savings', ja: '節約' } },
    options: { title: { ko: '옵션', en: 'Options', ja: 'オプション' }, comments: { ko: '주석 제거', en: 'No Comments', ja: 'コメント削除' }, whitespace: { ko: '공백 제거', en: 'No Whitespace', ja: '空白削除' }, semi: { ko: '마지막 세미콜론 제거', en: 'Remove Last ;', ja: '最後のセミコロン削除' }, hex: { ko: '색상 코드 단축', en: 'Shorten Hex', ja: '色コード短縮' }, zero: { ko: '0 단위 제거', en: 'Remove Zero Units', ja: '0単位削除' } },
    editor: { input: { ko: 'CSS 입력', en: 'Input CSS', ja: 'CSS入力' }, placeholder: { ko: '여기에 CSS를 붙여넣으세요...', en: 'Paste CSS...', ja: 'ここにCSSを貼り付け...' }, sample: { ko: '샘플', en: 'Sample', ja: 'サンプル' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } },
    output: { title: { ko: '압축 결과', en: 'Minified Output', ja: '圧縮結果' }, placeholder: { ko: '결과가 여기에 표시됩니다...', en: 'Result here...', ja: '結果がここに表示...' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, download: { ko: '다운로드', en: 'Download', ja: 'DL' } },
    btn: { minify: { ko: 'CSS 압축하기', en: 'Minify CSS', ja: 'CSS圧縮' } },
    info: { why: { ko: '왜 압축하나요?', en: 'Why Minify?', ja: 'なぜ圧縮するのか？' }, what: { ko: '무엇이 압축되나요?', en: 'What is removed?', ja: '何が削除されますか？' } }
  },
  'html-minifier': {
    meta: { title: { ko: 'HTML 압축기', en: 'HTML Minifier', ja: 'HTML圧縮機' }, desc: { ko: 'HTML 코드 압축', en: 'Minify HTML', ja: 'HTML圧縮' } },
    header: { title: { ko: 'HTML 압축기', en: 'HTML Minifier', ja: 'HTML圧縮機' }, subtitle: { ko: 'HTML 코드를 최적화하세요', en: 'Optimize HTML', ja: 'HTMLを最適化' } },
    options: { comments: { ko: '주석 제거', en: 'No Comments', ja: 'コメント削除' }, whitespace: { ko: '공백 제거', en: 'No Whitespace', ja: '空白削除' }, empty: { ko: '빈 속성 제거', en: 'No Empty Attrs', ja: '空属性削除' }, tags: { ko: '선택적 태그 제거', en: 'Opt Tags', ja: '省略可能タグ削除' }, style: { ko: '인라인 스타일 압축', en: 'Inline Style', ja: 'インラインスタイル圧縮' } },
    controls: { minify: { ko: '압축하기', en: 'Minify', ja: '圧縮' }, beautify: { ko: '정렬하기', en: 'Beautify', ja: '整形' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, sample: { ko: '샘플', en: 'Sample', ja: 'サンプル' } },
    panel: { input: { ko: 'HTML 입력', en: 'Input HTML', ja: 'HTML入力' }, placeholder: { ko: 'HTML을 붙여넣으세요...', en: 'Paste HTML...', ja: 'HTMLを貼り付け...' }, output: { ko: '결과', en: 'Output', ja: '出力' }, resPlaceholder: { ko: '결과가 여기에 표시됩니다...', en: 'Result here...', ja: '結果がここに表示...' } },
    stats: { size: { ko: '크기:', en: 'Size:', ja: 'サイズ:' }, lines: { ko: '줄 수:', en: 'Lines:', ja: '行数:' }, saved: { ko: '절약:', en: 'Saved:', ja: '節約:' } },
    features: { fast: { ko: '빠른 압축', en: 'Fast', ja: '高速圧縮' }, private: { ko: '100% 보안', en: 'Private', ja: '100%安全' }, custom: { ko: '설정 가능', en: 'Custom', ja: '設定可能' }, dl: { ko: '다운로드', en: 'Download', ja: 'ダウンロード' } },
    footer: { ko: '브라우저에서 안전하게 처리됩니다', en: 'Secure client-side processing', ja: 'ブラウザで安全に処理されます' }
  },
  'sql-formatter': {
    meta: { title: { ko: 'SQL 포맷터', en: 'SQL Formatter', ja: 'SQLフォーマッター' }, desc: { ko: 'SQL 쿼리 정렬', en: 'Format SQL', ja: 'SQL整形' } },
    header: { title: { ko: 'SQL 포맷터', en: 'SQL Formatter', ja: 'SQLフォーマッター' }, subtitle: { ko: 'SQL을 보기 좋게 정렬하세요', en: 'Beautify SQL', ja: 'SQLを綺麗に整形' } },
    options: { indent: { ko: '들여쓰기:', en: 'Indent:', ja: 'インデント:' }, case: { ko: '키워드:', en: 'Keywords:', ja: 'キーワード:' }, dialect: { ko: '언어:', en: 'Dialect:', ja: '言語:' } },
    controls: { format: { ko: '정렬하기', en: 'Format', ja: '整形' }, minify: { ko: '한 줄로', en: 'Minify', ja: '一行に' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } },
    panel: { input: { ko: 'SQL 입력', en: 'Input SQL', ja: 'SQL入力' }, placeholder: { ko: 'SQL 쿼리를 입력하세요...', en: 'Paste SQL...', ja: 'SQLクエリを入力...' }, output: { ko: '결과', en: 'Output', ja: '出力' }, status: { ko: '준비됨', en: 'Ready', ja: '準備完了' } },
    samples: { title: { ko: '샘플 쿼리', en: 'Sample Queries', ja: 'サンプルクエリ' } },
    features: { smart: { ko: '스마트 정렬', en: 'Smart Format', ja: 'スマート整形' }, high: { ko: '구문 강조', en: 'Highlight', ja: '構文強調' }, secure: { ko: '보안', en: 'Secure', ja: '安全' } },
    footer: { ko: '데이터 전송 없음', en: 'No data sent', ja: 'データ送信なし' }
  },
  'cron-generator': {
    meta: { title: { ko: '크론 생성기', en: 'Cron Generator', ja: 'Cron生成器' }, desc: { ko: '크론 표현식 생성', en: 'Create Cron', ja: 'Cron式生成' } },
    header: { title: { ko: '크론 생성기', en: 'Cron Generator', ja: 'Cron生成器' }, subtitle: { ko: '스케줄을 쉽게 만드세요', en: 'Easy scheduling', ja: 'スケジュール作成' } },
    result: { desc: { ko: '설명', en: 'Description', ja: '説明' }, next: { ko: '다음 실행:', en: 'Next runs:', ja: '次の実行:' }, copy: { ko: '표현식 복사', en: 'Copy Expr', ja: '式をコピー' } },
    fields: { min: { ko: '분', en: 'Minute', ja: '分' }, hour: { ko: '시', en: 'Hour', ja: '時' }, day: { ko: '일', en: 'Day', ja: '日' }, month: { ko: '월', en: 'Month', ja: '月' }, week: { ko: '요일', en: 'Weekday', ja: '曜日' } },
    tabs: { presets: { ko: '프리셋', en: 'Presets', ja: 'プリセット' }, builder: { ko: '빌더', en: 'Builder', ja: 'ビルダー' } },
    presets: { everyMin: { ko: '매 분', en: 'Every Minute', ja: '毎分' }, everyHour: { ko: '매 시간', en: 'Every Hour', ja: '毎時' }, daily: { ko: '매일 자정', en: 'Daily', ja: '毎日深夜' }, weekly: { ko: '매주 일요일', en: 'Weekly', ja: '毎週日曜' }, monthly: { ko: '매월 1일', en: 'Monthly', ja: '毎月1日' } },
    builder: { every: { ko: '매번', en: 'Every', ja: '毎回' } },
    ref: { title: { ko: '참조', en: 'Reference', ja: '参照' } },
    footer: { ko: '브라우저에서 처리됩니다', en: 'Client-side processing', ja: 'ブラウザ処理' }
  },
  'bmi-calculator': {
    meta: { title: { ko: 'BMI 계산기', en: 'BMI Calculator', ja: 'BMI計算機' }, desc: { ko: '체질량지수 계산', en: 'Calculate BMI', ja: 'BMI計算' } },
    header: { title: { ko: '⚖️ BMI 계산기', en: '⚖️ BMI Calculator', ja: '⚖️ BMI計算機' }, subtitle: { ko: '건강 상태 확인', en: 'Check Health', ja: '健康状態確認' } },
    input: { height: { ko: '키 (Height)', en: 'Height', ja: '身長' }, weight: { ko: '몸무게 (Weight)', en: 'Weight', ja: '体重' }, btn: { ko: 'BMI 계산하기', en: 'Calculate', ja: '計算' } },
    result: { val: { ko: 'BMI', en: 'BMI', ja: 'BMI' }, cat: { ko: '판정', en: 'Category', ja: '判定' }, ideal: { ko: '표준 체중', en: 'Ideal Weight', ja: '標準体重' }, range: { ko: '정상 범위', en: 'Normal Range', ja: '正常範囲' } },
    cats: { under: { ko: '저체중', en: 'Underweight', ja: '低体重' }, norm: { ko: '정상', en: 'Normal', ja: '正常' }, over: { ko: '과체중', en: 'Overweight', ja: '過体重' }, obese: { ko: '비만', en: 'Obese', ja: '肥満' }, severe: { ko: '고도비만', en: 'Severe', ja: '高度肥満' } },
    share: { ko: '결과 공유', en: 'Share', ja: '共有' },
    disclaimer: { ko: '참고용입니다.', en: 'Reference only.', ja: '参考用です。' }
  },
  'dday-calculator': {
    meta: { title: { ko: 'D-day 계산기', en: 'D-day Calculator', ja: 'D-day計算機' }, desc: { ko: '날짜 계산', en: 'Date Calc', ja: '日付計算' } },
    header: { title: { ko: '📅 D-day 계산기', en: '📅 D-day Calculator', ja: '📅 D-day計算機' }, subtitle: { ko: '남은 시간 확인', en: 'Check Time Left', ja: '残り時間確認' } },
    input: { name: { ko: '이벤트 이름', en: 'Event Name', ja: 'イベント名' }, date: { ko: '날짜 선택', en: 'Select Date', ja: '日付選択' }, btn: { ko: '계산하기', en: 'Calculate', ja: '計算' } },
    quick: { suneung: { ko: '수능', en: 'SAT', ja: '修能' }, newyear: { ko: '새해', en: 'New Year', ja: '新年' }, xmas: { ko: '크리스마스', en: 'Christmas', ja: 'クリスマス' } },
    result: { passed: { ko: '일 지남', en: 'days passed', ja: '日経過' }, left: { ko: '일 남음', en: 'days left', ja: '日残り' }, today: { ko: '오늘!', en: 'Today!', ja: '今日！' } },
    detail: { weeks: { ko: '주', en: 'Weeks', ja: '週' }, hours: { ko: '시간', en: 'Hours', ja: '時間' }, mins: { ko: '분', en: 'Mins', ja: '分' } },
    btns: { save: { ko: '저장', en: 'Save', ja: '保存' }, share: { ko: '공유', en: 'Share', ja: '共有' } },
    saved: { title: { ko: '📌 저장된 D-day', en: '📌 Saved', ja: '📌 保存済み' }, empty: { ko: '없음', en: 'Empty', ja: 'なし' } }
  },
  'percent-calculator': {
    meta: { title: { ko: '퍼센트 계산기', en: 'Percent Calculator', ja: 'パーセント計算機' }, desc: { ko: '비율 계산', en: 'Calc Percent', ja: '割合計算' } },
    header: { title: { ko: '🔢 퍼센트 계산기', en: '🔢 Percent Calculator', ja: '🔢 パーセント計算機' }, subtitle: { ko: '쉽게 계산하세요', en: 'Easy Calc', ja: '簡単計算' } },
    tabs: { basic: { ko: '기본', en: 'Basic', ja: '基本' }, discount: { ko: '할인', en: 'Discount', ja: '割引' }, change: { ko: '증감', en: 'Change', ja: '増減' }, ratio: { ko: '비율', en: 'Ratio', ja: '割合' } },
    basic: { title: { ko: 'A의 B%는?', en: 'B% of A?', ja: 'AのB%は?' }, btn: { ko: '계산', en: 'Calc', ja: '計算' }, res: { ko: '결과', en: 'Result', ja: '結果' } },
    discount: { title: { ko: '할인가 계산', en: 'Discount Price', ja: '割引価格' }, btn: { ko: '계산', en: 'Calc', ja: '計算' }, res: { ko: '할인가', en: 'Price', ja: '価格' }, saved: { ko: '할인액', en: 'Saved', ja: '割引額' } },
    change: { title: { ko: '증감률', en: 'Change Rate', ja: '増減率' }, btn: { ko: '계산', en: 'Calc', ja: '計算' }, res: { ko: '증감률', en: 'Rate', ja: '率' }, diff: { ko: '차이', en: 'Diff', ja: '差' } },
    ratio: { title: { ko: '비율 계산', en: 'Ratio Calc', ja: '割合計算' }, btn: { ko: '계산', en: 'Calc', ja: '計算' }, res: { ko: '비율', en: 'Ratio', ja: '割合' } },
    common: { copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, quick: { ko: '빠른 계산', en: 'Quick', ja: 'クイック' } }
  },
  'unit-converter': {
    meta: { title: { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換器' }, desc: { ko: '단위 변환', en: 'Convert Units', ja: '単位変換' } },
    header: { title: { ko: '📐 단위 변환기', en: '📐 Unit Converter', ja: '📐 単位変換器' }, subtitle: { ko: '단위 변환 도구', en: 'Unit Tool', ja: '単位ツール' } },
    tabs: { len: { ko: '길이', en: 'Length', ja: '長さ' }, weight: { ko: '무게', en: 'Weight', ja: '重さ' }, temp: { ko: '온도', en: 'Temp', ja: '温度' }, area: { ko: '면적', en: 'Area', ja: '面積' }, vol: { ko: '부피', en: 'Volume', ja: '体積' } },
    input: { from: { ko: '변환 전', en: 'From', ja: '変換前' }, to: { ko: '변환 후', en: 'To', ja: '変換後' } },
    result: { copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    common: { title: { ko: '자주 쓰는 변환', en: 'Common', ja: 'よく使う変換' } }
  },
  'aspect-ratio': {
    meta: { title: { ko: '비율 계산기', en: 'Aspect Ratio', ja: 'アスペクト比' }, desc: { ko: '이미지/영상 비율', en: 'Image/Video Ratio', ja: '画像/映像比率' } },
    header: { title: { ko: '비율 계산기', en: 'Aspect Ratio Calc', ja: 'アスペクト比計算' }, subtitle: { ko: '이미지 & 영상 크기 계산', en: 'Image & Video Dimensions', ja: '画像＆映像サイズ' } },
    input: { label: { ko: '원본 크기', en: 'Original Dimensions', ja: '元サイズ' }, scale: { ko: '변환 크기', en: 'Scale Dimensions', ja: '変換サイズ' } },
    result: { ratio: { ko: '비율', en: 'Ratio', ja: '比率' }, decimal: { ko: '소수점', en: 'Decimal', ja: '小数' }, pixels: { ko: '픽셀 수', en: 'Pixels', ja: 'ピクセル数' }, mega: { ko: '메가픽셀', en: 'Megapixels', ja: 'メガピクセル' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    presets: { title: { ko: '프리셋', en: 'Presets', ja: 'プリセット' }, video: { ko: '비디오', en: 'Video', ja: 'ビデオ' }, social: { ko: '소셜 미디어', en: 'Social', ja: 'ソーシャル' }, photo: { ko: '사진', en: 'Photo', ja: '写真' }, classic: { ko: '클래식', en: 'Classic', ja: 'クラシック' } },
    features: { resize: { ko: '이미지 리사이징', en: 'Resizing', ja: 'サイズ変更' }, video: { ko: '비디오 포맷', en: 'Video Formats', ja: 'ビデオ形式' }, social: { ko: '소셜 미디어', en: 'Social Media', ja: 'ソーシャル' }, lock: { ko: '비율 고정', en: 'Lock Ratio', ja: '比率固定' } }
  },
  'box-shadow': {
    meta: { title: { ko: '박스 쉐도우 생성기', en: 'Box Shadow Generator', ja: 'ボックスシャドウ生成' }, desc: { ko: 'CSS 그림자 생성', en: 'Create CSS Shadows', ja: 'CSS影生成' } },
    header: { title: { ko: '박스 쉐도우 생성기', en: 'Box Shadow Generator', ja: 'ボックスシャドウ生成' }, subtitle: { ko: 'CSS 그림자를 만드세요', en: 'Create CSS Shadows', ja: 'CSS影を作成' } },
    controls: { tab: { ko: '레이어', en: 'Layer', ja: 'レイヤー' }, add: { ko: '+ 추가', en: '+ Add', ja: '+ 追加' }, h: { ko: '가로', en: 'Horizontal', ja: '水平' }, v: { ko: '세로', en: 'Vertical', ja: '垂直' }, blur: { ko: '흐림', en: 'Blur', ja: 'ぼかし' }, spread: { ko: '확장', en: 'Spread', ja: '広がり' }, color: { ko: '색상 & 투명도', en: 'Color & Opacity', ja: '色＆不透明度' }, inset: { ko: '내부 그림자', en: 'Inset Shadow', ja: '内側の影' }, remove: { ko: '레이어 삭제', en: 'Remove Layer', ja: 'レイヤー削除' } },
    code: { title: { ko: 'CSS 코드', en: 'CSS Code', ja: 'CSSコード' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    presets: { title: { ko: '프리셋', en: 'Presets', ja: 'プリセット' } }
  },
  'color-palette': {
    meta: { title: { ko: '컬러 팔레트', en: 'Color Palette', ja: 'カラーパレット' }, desc: { ko: '색상 조합 생성', en: 'Generate Colors', ja: '配色生成' } },
    header: { title: { ko: '컬러 팔레트', en: 'Color Palette', ja: 'カラーパレット' }, subtitle: { ko: '아름다운 색상 조합', en: 'Beautiful Schemes', ja: '美しい配色' } },
    controls: { scheme: { ko: '조합 방식', en: 'Scheme', ja: '配色パターン' }, base: { ko: '기준 색상', en: 'Base Color', ja: '基準色' }, gen: { ko: '생성 (Space)', en: 'Generate (Space)', ja: '生成 (Space)' }, save: { ko: '저장', en: 'Save', ja: '保存' } },
    export: { title: { ko: '내보내기', en: 'Export', ja: 'エクスポート' } },
    saved: { title: { ko: '저장된 팔레트', en: 'Saved Palettes', ja: '保存されたパレット' } },
    features: { multi: { ko: '다양한 조합', en: 'Multiple Schemes', ja: '多様なパターン' }, lock: { ko: '색상 잠금', en: 'Lock Colors', ja: '色をロック' }, exp: { ko: '쉬운 내보내기', en: 'Easy Export', ja: '簡単エクスポート' }, save: { ko: '저장 기능', en: 'Save Feature', ja: '保存機能' } }
  },
  'css-gradient': {
    meta: { title: { ko: 'CSS 그라디언트', en: 'CSS Gradient', ja: 'CSSグラデーション' }, desc: { ko: '그라디언트 생성', en: 'Create Gradient', ja: 'グラデーション作成' } },
    header: { title: { ko: 'CSS 그라디언트', en: 'CSS Gradient', ja: 'CSSグラデーション' }, subtitle: { ko: '그라디언트 배경 생성', en: 'Create Backgrounds', ja: '背景作成' } },
    controls: { type: { ko: '종류', en: 'Type', ja: '種類' }, dir: { ko: '방향', en: 'Direction', ja: '方向' }, angle: { ko: '각도', en: 'Angle', ja: '角度' }, stops: { ko: '색상 지점', en: 'Color Stops', ja: '色分岐点' }, add: { ko: '+ 색상 추가', en: '+ Add Color', ja: '+ 色追加' } },
    code: { title: { ko: 'CSS 코드', en: 'CSS Code', ja: 'CSSコード' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } },
    presets: { title: { ko: '프리셋', en: 'Presets', ja: 'プリセット' } }
  }
};
