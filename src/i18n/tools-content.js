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
    ui: { selectType: { ko: '유형 선택', en: 'Select Type', ja: 'タイプ選択' }, generate: { ko: '운세 보기', en: 'View Fortune', ja: '運勢を見る' }, loading: { ko: '분석 중...', en: 'Analyzing...', ja: '分析中...' }, overall: { ko: '총운', en: 'Overall', ja: '総運' }, mainTitle: { ko: '상세 풀이', en: 'Details', ja: '詳細' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, share: { ko: '공유', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Retry', ja: 'もう一度' }, footer: { ko: '운세는 재미로만 봐주세요 😊', en: 'For entertainment only 😊', ja: '運勢は楽しみ程度に 😊' } },
    categories: { love: { ko: '애정운', en: 'Love', ja: '恋愛' }, money: { ko: '금전운', en: 'Money', ja: '金運' }, work: { ko: '직장운', en: 'Work', ja: '仕事' }, health: { ko: '건강운', en: 'Health', ja: '健康' } },
    advice: { number: { ko: '행운의 숫자', en: 'Lucky Num', ja: 'ラッキー数' }, color: { ko: '행운의 색', en: 'Lucky Color', ja: 'ラッキー色' }, direction: { ko: '행운의 방향', en: 'Direction', ja: '方向' }, tip: { ko: '조언', en: 'Tip', ja: '助言' } },
    zodiac: {
      aries: { ko: '양자리', en: 'Aries', ja: '牡羊座' }, taurus: { ko: '황소자리', en: 'Taurus', ja: '牡牛座' }, gemini: { ko: '쌍둥이자리', en: 'Gemini', ja: '双子座' }, cancer: { ko: '게자리', en: 'Cancer', ja: '蟹座' }, leo: { ko: '사자자리', en: 'Leo', ja: '獅子座' }, virgo: { ko: '처녀자리', en: 'Virgo', ja: '乙女座' }, libra: { ko: '천칭자리', en: 'Libra', ja: '天秤座' }, scorpio: { ko: '전갈자리', en: 'Scorpio', ja: '蠍座' }, sagittarius: { ko: '사수자리', en: 'Sagittarius', ja: '射手座' }, capricorn: { ko: '염소자리', en: 'Capricorn', ja: '山羊座' }, aquarius: { ko: '물병자리', en: 'Aquarius', ja: '水瓶座' }, pisces: { ko: '물고기자리', en: 'Pisces', ja: '魚座' }
    },
    chinese: {
      rat: { ko: '쥐띠', en: 'Rat', ja: '子年' }, ox: { ko: '소띠', en: 'Ox', ja: '丑年' }, tiger: { ko: '호랑이띠', en: 'Tiger', ja: '寅年' }, rabbit: { ko: '토끼띠', en: 'Rabbit', ja: '卯年' }, dragon: { ko: '용띠', en: 'Dragon', ja: '辰年' }, snake: { ko: '뱀띠', en: 'Snake', ja: '巳年' }, horse: { ko: '말띠', en: 'Horse', ja: '午年' }, sheep: { ko: '양띠', en: 'Sheep', ja: '未年' }, monkey: { ko: '원숭이띠', en: 'Monkey', ja: '申年' }, rooster: { ko: '닭띠', en: 'Rooster', ja: '酉年' }, dog: { ko: '개띠', en: 'Dog', ja: '戌年' }, pig: { ko: '돼지띠', en: 'Pig', ja: '亥年' }
    },
    blood: {
      A: { ko: 'A형', en: 'Type A', ja: 'A型' }, B: { ko: 'B형', en: 'Type B', ja: 'B型' }, O: { ko: 'O형', en: 'Type O', ja: 'O型' }, AB: { ko: 'AB형', en: 'Type AB', ja: 'AB型' }
    },
    colors: { red: { ko: '빨강', en: 'Red', ja: '赤' }, blue: { ko: '파랑', en: 'Blue', ja: '青' }, green: { ko: '초록', en: 'Green', ja: '緑' }, yellow: { ko: '노랑', en: 'Yellow', ja: '黄' }, purple: { ko: '보라', en: 'Purple', ja: '紫' }, white: { ko: '흰색', en: 'White', ja: '白' }, black: { ko: '검정', en: 'Black', ja: '黒' }, gold: { ko: '금색', en: 'Gold', ja: '金色' } },
    directions: { east: { ko: '동쪽', en: 'East', ja: '東' }, west: { ko: '서쪽', en: 'West', ja: '西' }, south: { ko: '남쪽', en: 'South', ja: '南' }, north: { ko: '북쪽', en: 'North', ja: '北' } }
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
  },

  // === 재미 도구 (Fun Tools) ===
  'ai-tarot': {
    meta: { title: { ko: 'AI 타로 카드', en: 'AI Tarot Card', ja: 'AIタロットカード' }, desc: { ko: '무료 온라인 타로 점', en: 'Free Online Tarot Reading', ja: '無料オンラインタロット占い' } },
    header: { title: { ko: 'AI 타로 카드', en: 'AI Tarot Card', ja: 'AIタロットカード' }, subtitle: { ko: '신비로운 타로 카드로 오늘의 운세를 확인하세요', en: 'Check your fortune with mystical tarot cards', ja: '神秘的なタロットカードで今日の運勢を確認' } },
    disclaimer: { ko: '재미로 즐기는 타로 점입니다. 중요한 결정은 신중하게 판단하세요.', en: 'This is for entertainment. Make important decisions carefully.', ja: '娯楽用のタロット占いです。重要な決定は慎重に。' },
    spreads: { title: { ko: '어떤 스프레드로 볼까요?', en: 'Choose a spread', ja: 'スプレッドを選んでください' }, oneCard: { name: { ko: '원카드', en: 'One Card', ja: 'ワンカード' }, desc: { ko: '오늘의 메시지\n간단한 질문에 적합', en: 'Today\'s message\nFor simple questions', ja: '今日のメッセージ\n簡単な質問に最適' } }, threeCard: { name: { ko: '쓰리카드', en: 'Three Cards', ja: 'スリーカード' }, desc: { ko: '과거-현재-미래\n상황 분석에 적합', en: 'Past-Present-Future\nFor situation analysis', ja: '過去-現在-未来\n状況分析に最適' } }, loveCard: { name: { ko: '연애운', en: 'Love Fortune', ja: '恋愛運' }, desc: { ko: '나-상대-관계-조언-결과\n연애 고민에 적합', en: 'Me-Partner-Relationship-Advice-Result\nFor love concerns', ja: '私-相手-関係-アドバイス-結果\n恋愛相談に最適' } } },
    question: { title: { ko: '질문을 입력하세요 (선택)', en: 'Enter your question (optional)', ja: '質問を入力してください（任意）' }, placeholder: { ko: '예: 이번 달 나의 연애운은 어떨까요?', en: 'e.g., How is my love fortune this month?', ja: '例：今月の私の恋愛運はどうですか？' } },
    buttons: { draw: { ko: '카드 뽑기', en: 'Draw Cards', ja: 'カードを引く' }, reveal: { ko: '해석 보기', en: 'View Reading', ja: '解釈を見る' }, share: { ko: '결과 공유하기', en: 'Share Result', ja: '結果を共有' }, retry: { ko: '다시 뽑기', en: 'Draw Again', ja: 'もう一度引く' } },
    card: { clickToFlip: { ko: '카드를 클릭하여 뒤집으세요', en: 'Click cards to flip', ja: 'カードをクリックして裏返す' }, remaining: { ko: '남은 카드:', en: 'Cards left:', ja: '残りカード:' }, allFlipped: { ko: '모든 카드를 뒤집었습니다!', en: 'All cards flipped!', ja: '全てのカードを裏返しました！' }, reversed: { ko: '(역방향)', en: '(Reversed)', ja: '（逆位置）' } },
    loading: { ko: '타로 카드의 의미를 해석하고 있습니다...', en: 'Interpreting the tarot cards...', ja: 'タロットカードの意味を解釈しています...' },
    reading: { question: { ko: '질문', en: 'Question', ja: '質問' }, upright: { ko: '정방향 의미', en: 'Upright Meaning', ja: '正位置の意味' }, reversed: { ko: '역방향 의미', en: 'Reversed Meaning', ja: '逆位置の意味' }, overall: { ko: '종합 해석', en: 'Overall Reading', ja: '総合解釈' } },
    footer: { ko: '이 타로 점은 재미와 영감을 위한 것입니다.\n중요한 결정은 전문가와 상담하세요.', en: 'This tarot reading is for entertainment and inspiration.\nConsult professionals for important decisions.', ja: 'このタロット占いは娯楽とインスピレーションのためのものです。\n重要な決定は専門家に相談してください。' },
    positions: { todayMessage: { ko: '오늘의 메시지', en: "Today's Message", ja: '今日のメッセージ' }, past: { ko: '과거', en: 'Past', ja: '過去' }, present: { ko: '현재', en: 'Present', ja: '現在' }, future: { ko: '미래', en: 'Future', ja: '未来' }, myState: { ko: '나의 상태', en: 'My State', ja: '私の状態' }, partnerHeart: { ko: '상대의 마음', en: "Partner's Heart", ja: '相手の心' }, currentRelation: { ko: '현재 관계', en: 'Current Relationship', ja: '現在の関係' }, advice: { ko: '조언', en: 'Advice', ja: 'アドバイス' }, futureResult: { ko: '미래 결과', en: 'Future Result', ja: '未来の結果' } },
    cardDirection: { upright: { ko: '(정방향)', en: '(Upright)', ja: '（正位置）' }, reversed: { ko: '(역방향)', en: '(Reversed)', ja: '（逆位置）' } },
    cardNames: { fool: { ko: '광대', en: 'The Fool', ja: '愚者' }, magician: { ko: '마법사', en: 'The Magician', ja: '魔術師' }, highPriestess: { ko: '여사제', en: 'The High Priestess', ja: '女教皇' }, empress: { ko: '여황제', en: 'The Empress', ja: '女帝' }, emperor: { ko: '황제', en: 'The Emperor', ja: '皇帝' }, hierophant: { ko: '교황', en: 'The Hierophant', ja: '教皇' }, lovers: { ko: '연인', en: 'The Lovers', ja: '恋人' }, chariot: { ko: '전차', en: 'The Chariot', ja: '戦車' }, strength: { ko: '힘', en: 'Strength', ja: '力' }, hermit: { ko: '은둔자', en: 'The Hermit', ja: '隠者' }, wheelOfFortune: { ko: '운명의 수레바퀴', en: 'Wheel of Fortune', ja: '運命の輪' }, justice: { ko: '정의', en: 'Justice', ja: '正義' }, hangedMan: { ko: '매달린 사람', en: 'The Hanged Man', ja: '吊された男' }, death: { ko: '죽음', en: 'Death', ja: '死神' }, temperance: { ko: '절제', en: 'Temperance', ja: '節制' }, devil: { ko: '악마', en: 'The Devil', ja: '悪魔' }, tower: { ko: '탑', en: 'The Tower', ja: '塔' }, star: { ko: '별', en: 'The Star', ja: '星' }, moon: { ko: '달', en: 'The Moon', ja: '月' }, sun: { ko: '태양', en: 'The Sun', ja: '太陽' }, judgement: { ko: '심판', en: 'Judgement', ja: '審判' }, world: { ko: '세계', en: 'The World', ja: '世界' } },
    misc: { remainingCards: { ko: '남은 카드:', en: 'Cards left:', ja: '残りカード:' }, todayFortune: { ko: '오늘의 운세', en: "Today's Fortune", ja: '今日の運勢' }, copyResult: { ko: '결과가 복사되었어요!', en: 'Result copied!', ja: '結果がコピーされました！' }, todayTarot: { ko: '오늘의 타로:', en: "Today's Tarot:", ja: '今日のタロット:' }, tryMe: { ko: '나도 뽑아보기', en: 'Try it too', ja: '私も引いてみる' }, cards: { ko: '장', en: '', ja: '枚' }, result: { ko: '결과', en: 'Result', ja: '結果' }, allCardsFlipped: { ko: '모든 카드를 뒤집었습니다!', en: 'All cards flipped!', ja: 'すべてのカードをめくりました！' } },
    cardMeanings: {
      fool: { upright: { ko: '새로운 시작, 순수함, 자유로운 영혼, 모험', en: 'New beginnings, innocence, free spirit, adventure', ja: '新しい始まり、純粋さ、自由な魂、冒険' }, reversed: { ko: '무모함, 경솔함, 위험 감수', en: 'Recklessness, carelessness, risk-taking', ja: '無謀さ、軽率さ、リスクを取る' } },
      magician: { upright: { ko: '창조력, 의지력, 기술, 능력 발휘', en: 'Creativity, willpower, skill, manifestation', ja: '創造力、意志力、技術、能力発揮' }, reversed: { ko: '속임수, 능력 남용, 미숙함', en: 'Trickery, misuse of power, inexperience', ja: '欺瞞、能力の乱用、未熟さ' } },
      highPriestess: { upright: { ko: '직관, 신비, 내면의 지혜, 잠재의식', en: 'Intuition, mystery, inner wisdom, subconscious', ja: '直感、神秘、内なる知恵、潜在意識' }, reversed: { ko: '숨겨진 동기, 직관 무시, 비밀', en: 'Hidden agendas, ignoring intuition, secrets', ja: '隠された動機、直感無視、秘密' } },
      empress: { upright: { ko: '풍요, 모성애, 아름다움, 자연', en: 'Abundance, motherhood, beauty, nature', ja: '豊穣、母性愛、美しさ、自然' }, reversed: { ko: '의존성, 창조력 부족, 과잉보호', en: 'Dependence, lack of creativity, overprotection', ja: '依存性、創造力不足、過保護' } },
      emperor: { upright: { ko: '권위, 안정, 리더십, 구조', en: 'Authority, stability, leadership, structure', ja: '権威、安定、リーダーシップ、構造' }, reversed: { ko: '독재, 경직됨, 통제 과잉', en: 'Tyranny, rigidity, excessive control', ja: '独裁、硬直、過剰なコントロール' } },
      hierophant: { upright: { ko: '전통, 신념, 가르침, 영적 지도', en: 'Tradition, beliefs, teaching, spiritual guidance', ja: '伝統、信念、教え、精神的導き' }, reversed: { ko: '관습 타파, 새로운 방식, 반항', en: 'Breaking conventions, new ways, rebellion', ja: '慣習打破、新しい方法、反抗' } },
      lovers: { upright: { ko: '사랑, 조화, 선택, 관계', en: 'Love, harmony, choices, relationships', ja: '愛、調和、選択、関係' }, reversed: { ko: '불균형, 갈등, 잘못된 선택', en: 'Imbalance, conflict, poor choices', ja: '不均衡、葛藤、間違った選択' } },
      chariot: { upright: { ko: '승리, 의지력, 결단력, 행동', en: 'Victory, willpower, determination, action', ja: '勝利、意志力、決断力、行動' }, reversed: { ko: '장애물, 방향 상실, 공격성', en: 'Obstacles, loss of direction, aggression', ja: '障害、方向喪失、攻撃性' } },
      strength: { upright: { ko: '용기, 인내, 내면의 힘, 자제력', en: 'Courage, patience, inner strength, self-control', ja: '勇気、忍耐、内なる力、自制心' }, reversed: { ko: '자기 의심, 약함, 불안', en: 'Self-doubt, weakness, anxiety', ja: '自己疑念、弱さ、不安' } },
      hermit: { upright: { ko: '내면 탐구, 명상, 지혜 추구, 고독', en: 'Inner search, meditation, seeking wisdom, solitude', ja: '内省、瞑想、知恵の追求、孤独' }, reversed: { ko: '고립, 외로움, 지나친 은둔', en: 'Isolation, loneliness, excessive withdrawal', ja: '孤立、寂しさ、過度の引きこもり' } },
      wheelOfFortune: { upright: { ko: '변화, 순환, 행운, 전환점', en: 'Change, cycles, luck, turning point', ja: '変化、循環、幸運、転換点' }, reversed: { ko: '저항, 불운, 변화 거부', en: 'Resistance, bad luck, refusing change', ja: '抵抗、不運、変化の拒否' } },
      justice: { upright: { ko: '공정함, 진실, 균형, 인과응보', en: 'Fairness, truth, balance, karma', ja: '公正さ、真実、均衡、因果応報' }, reversed: { ko: '불공정, 부정직, 책임 회피', en: 'Unfairness, dishonesty, avoiding responsibility', ja: '不公正、不誠実、責任回避' } },
      hangedMan: { upright: { ko: '희생, 새로운 시각, 인내, 깨달음', en: 'Sacrifice, new perspective, patience, enlightenment', ja: '犠牲、新しい視点、忍耐、悟り' }, reversed: { ko: '지연, 저항, 무의미한 희생', en: 'Delay, resistance, meaningless sacrifice', ja: '遅延、抵抗、無意味な犠牲' } },
      death: { upright: { ko: '끝과 시작, 변화, 전환, 재탄생', en: 'Endings and beginnings, change, transition, rebirth', ja: '終わりと始まり、変化、転換、再生' }, reversed: { ko: '변화 저항, 정체, 두려움', en: 'Resisting change, stagnation, fear', ja: '変化への抵抗、停滞、恐れ' } },
      temperance: { upright: { ko: '균형, 조화, 인내, 중용', en: 'Balance, harmony, patience, moderation', ja: '均衡、調和、忍耐、中庸' }, reversed: { ko: '불균형, 극단, 과잉', en: 'Imbalance, extremes, excess', ja: '不均衡、極端、過剰' } },
      devil: { upright: { ko: '속박, 유혹, 물질주의, 그림자 자아', en: 'Bondage, temptation, materialism, shadow self', ja: '束縛、誘惑、物質主義、影の自己' }, reversed: { ko: '해방, 두려움 극복, 자유', en: 'Liberation, overcoming fear, freedom', ja: '解放、恐怖の克服、自由' } },
      tower: { upright: { ko: '급격한 변화, 혼란, 깨달음, 해방', en: 'Sudden change, chaos, revelation, liberation', ja: '急激な変化、混乱、悟り、解放' }, reversed: { ko: '변화 회피, 재난 방지, 두려움', en: 'Avoiding change, averting disaster, fear', ja: '変化回避、災害防止、恐れ' } },
      star: { upright: { ko: '희망, 영감, 평화, 치유', en: 'Hope, inspiration, peace, healing', ja: '希望、インスピレーション、平和、癒し' }, reversed: { ko: '절망, 희망 상실, 불신', en: 'Despair, loss of hope, distrust', ja: '絶望、希望喪失、不信' } },
      moon: { upright: { ko: '직관, 꿈, 무의식, 환상', en: 'Intuition, dreams, subconscious, illusion', ja: '直感、夢、無意識、幻想' }, reversed: { ko: '혼란, 두려움, 기만', en: 'Confusion, fear, deception', ja: '混乱、恐怖、欺瞞' } },
      sun: { upright: { ko: '기쁨, 성공, 활력, 긍정', en: 'Joy, success, vitality, positivity', ja: '喜び、成功、活力、前向き' }, reversed: { ko: '일시적 우울, 자만, 지연된 성공', en: 'Temporary sadness, ego, delayed success', ja: '一時的な憂鬱、自惚れ、遅れた成功' } },
      judgement: { upright: { ko: '부활, 각성, 평가, 재탄생', en: 'Rebirth, awakening, judgment, renewal', ja: '復活、覚醒、評価、再生' }, reversed: { ko: '자기 의심, 판단 회피, 후회', en: 'Self-doubt, avoiding judgment, regret', ja: '自己疑念、判断回避、後悔' } },
      world: { upright: { ko: '완성, 통합, 성취, 여행', en: 'Completion, integration, achievement, travel', ja: '完成、統合、達成、旅' }, reversed: { ko: '미완성, 지연, 목표 부재', en: 'Incompletion, delays, lack of goals', ja: '未完成、遅延、目標の欠如' } }
    }
  },
  'dream-interpreter': {
    meta: { title: { ko: 'AI 꿈 해몽', en: 'AI Dream Interpreter', ja: 'AI夢占い' }, desc: { ko: '무료 꿈 해석, 꿈풀이', en: 'Free Dream Interpretation', ja: '無料夢解釈' } },
    header: { title: { ko: 'AI 꿈 해몽', en: 'AI Dream Interpreter', ja: 'AI夢占い' }, subtitle: { ko: '당신의 꿈이 전하는 메시지를 해석해드려요', en: 'Interpret the messages from your dreams', ja: 'あなたの夢が伝えるメッセージを解釈します' } },
    input: { label: { ko: '✨ 어젯밤 어떤 꿈을 꾸셨나요?', en: '✨ What did you dream about last night?', ja: '✨ 昨夜どんな夢を見ましたか？' }, placeholder: { ko: '꿈의 내용을 자세히 적어주세요.\n\n예: 하늘을 나는 꿈을 꿨어요...', en: 'Describe your dream in detail.\n\ne.g., I dreamed of flying in the sky...', ja: '夢の内容を詳しく書いてください。\n\n例：空を飛ぶ夢を見ました...' } },
    quickDreams: { pig: { ko: '🐷 돼지꿈', en: '🐷 Pig Dream', ja: '🐷 豚の夢' }, snake: { ko: '🐍 뱀꿈', en: '🐍 Snake Dream', ja: '🐍 蛇の夢' }, teeth: { ko: '🦷 이빨꿈', en: '🦷 Teeth Dream', ja: '🦷 歯の夢' }, water: { ko: '🌊 물꿈', en: '🌊 Water Dream', ja: '🌊 水の夢' }, flying: { ko: '🦅 비행꿈', en: '🦅 Flying Dream', ja: '🦅 飛行の夢' }, deceased: { ko: '👻 고인꿈', en: '👻 Deceased Dream', ja: '👻 故人の夢' } },
    buttons: { interpret: { ko: '🔮 꿈 해몽하기', en: '🔮 Interpret Dream', ja: '🔮 夢を解釈する' }, copy: { ko: '📋 결과 복사', en: '📋 Copy Result', ja: '📋 結果をコピー' }, share: { ko: '📤 공유하기', en: '📤 Share', ja: '📤 共有する' }, newDream: { ko: '🔄 새로운 꿈', en: '🔄 New Dream', ja: '🔄 新しい夢' } },
    loading: { ko: '해몽 중...', en: 'Interpreting...', ja: '解釈中...' },
    result: { fortuneGood: { ko: '길몽', en: 'Good Fortune', ja: '吉夢' }, fortuneNeutral: { ko: '평몽', en: 'Neutral', ja: '普通の夢' }, fortuneBad: { ko: '주의가 필요한 꿈', en: 'Caution Needed', ja: '注意が必要な夢' }, fortuneIndex: { ko: '행운 지수:', en: 'Fortune Index:', ja: '幸運指数:' }, interpretation: { ko: '📖 꿈의 해석', en: '📖 Dream Interpretation', ja: '📖 夢の解釈' }, symbols: { ko: '🎯 상징과 의미', en: '🎯 Symbols & Meanings', ja: '🎯 象徴と意味' }, luck: { ko: '💫 오늘의 행운', en: '💫 Today\'s Luck', ja: '💫 今日の幸運' }, luckyNumber: { ko: '행운의 숫자', en: 'Lucky Number', ja: 'ラッキーナンバー' }, luckyColor: { ko: '행운의 색', en: 'Lucky Color', ja: 'ラッキーカラー' }, luckyDirection: { ko: '행운의 방향', en: 'Lucky Direction', ja: 'ラッキー方向' }, advice: { ko: '💡 조언', en: '💡 Advice', ja: '💡 アドバイス' } },
    popular: { title: { ko: '🌟 자주 찾는 꿈 해몽', en: '🌟 Popular Dream Interpretations', ja: '🌟 人気の夢解釈' } },
    footer: { ko: '꿈은 무의식이 보내는 메시지입니다 🌙', en: 'Dreams are messages from the unconscious 🌙', ja: '夢は無意識からのメッセージです 🌙' }
  },
  'compatibility-test': {
    meta: { title: { ko: 'AI 궁합 테스트', en: 'AI Compatibility Test', ja: 'AI相性テスト' }, desc: { ko: '무료 이름 궁합, 연애 궁합', en: 'Free Name & Love Compatibility', ja: '無料名前相性・恋愛相性' } },
    header: { title: { ko: 'AI 궁합 테스트', en: 'AI Compatibility Test', ja: 'AI相性テスト' }, subtitle: { ko: '이름과 생년월일로 알아보는 두 사람의 운명', en: 'Discover your destiny through names and birth dates', ja: '名前と生年月日で二人の運命を知る' } },
    disclaimer: { ko: '재미로 즐기는 궁합 테스트입니다. 결과는 참고용으로만 봐주세요!', en: 'This is for entertainment. Results are for reference only!', ja: '娯楽用の相性テストです。結果は参考程度に！' },
    person: { first: { ko: '💗 첫 번째 사람', en: '💗 First Person', ja: '💗 一人目' }, second: { ko: '💜 두 번째 사람', en: '💜 Second Person', ja: '💜 二人目' } },
    input: { name: { ko: '이름', en: 'Name', ja: '名前' }, namePlaceholder: { ko: '이름을 입력하세요', en: 'Enter name', ja: '名前を入力' }, birthDate: { ko: '생년월일', en: 'Birth Date', ja: '生年月日' }, year: { ko: '년도', en: 'Year', ja: '年' }, month: { ko: '월', en: 'Month', ja: '月' }, day: { ko: '일', en: 'Day', ja: '日' } },
    buttons: { check: { ko: '💕 궁합 확인하기', en: '💕 Check Compatibility', ja: '💕 相性を確認' }, share: { ko: '결과 공유하기', en: 'Share Result', ja: '結果を共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    loading: { ko: '두 분의 궁합을 분석하고 있어요...', en: 'Analyzing your compatibility...', ja: '二人の相性を分析中...' },
    result: { score: { ko: '궁합 점수', en: 'Compatibility Score', ja: '相性スコア' }, categories: { love: { ko: '💗 애정운', en: '💗 Love', ja: '💗 愛情運' }, communication: { ko: '💬 소통력', en: '💬 Communication', ja: '💬 コミュニケーション' }, trust: { ko: '🤝 신뢰도', en: '🤝 Trust', ja: '🤝 信頼度' }, future: { ko: '🌟 미래', en: '🌟 Future', ja: '🌟 未来' } }, messages: { perfect: { ko: '운명적인 만남! 천생연분이에요! 💕', en: 'Destined encounter! Soulmates! 💕', ja: '運命の出会い！天生の縁！💕' }, great: { ko: '환상의 궁합! 서로를 위해 태어났어요! ✨', en: 'Perfect match! Made for each other! ✨', ja: '最高の相性！お互いのために生まれた！✨' }, good: { ko: '좋은 궁합! 함께라면 행복해요! 😊', en: 'Good compatibility! Happy together! 😊', ja: '良い相性！一緒にいれば幸せ！😊' }, okay: { ko: '괜찮은 궁합! 노력하면 더 좋아져요! 💪', en: 'Decent match! Will improve with effort! 💪', ja: 'まずまずの相性！努力で良くなる！💪' }, average: { ko: '보통 궁합! 서로 이해가 필요해요! 🤔', en: 'Average! Understanding needed! 🤔', ja: '普通の相性！理解が必要！🤔' }, challenging: { ko: '도전적인 궁합! 많은 노력이 필요해요! 💭', en: 'Challenging! Requires much effort! 💭', ja: '挑戦的な相性！多くの努力が必要！💭' } } },
    footer: { ko: '이 테스트는 재미를 위한 것입니다.\n실제 관계는 서로의 노력으로 만들어집니다.', en: 'This test is for entertainment.\nReal relationships are built through mutual effort.', ja: 'このテストは娯楽用です。\n実際の関係はお互いの努力で築かれます。' }
  },
  'saju-fortune': {
    meta: { title: { ko: '사주 풀이', en: 'Saju Fortune', ja: '四柱推命' }, desc: { ko: '생년월일 사주팔자', en: 'Birth Date Fortune', ja: '生年月日運勢' } },
    header: { title: { ko: '사주 풀이', en: 'Saju Fortune', ja: '四柱推命' }, subtitle: { ko: '생년월일로 알아보는 나의 운명', en: 'Your destiny through birth date', ja: '生年月日で知る私の運命' } },
    input: { birthDate: { ko: '생년월일', en: 'Birth Date', ja: '生年月日' }, birthTime: { ko: '태어난 시간', en: 'Birth Time', ja: '生まれた時間' }, gender: { ko: '성별', en: 'Gender', ja: '性別' }, male: { ko: '남성', en: 'Male', ja: '男性' }, female: { ko: '여성', en: 'Female', ja: '女性' } },
    buttons: { analyze: { ko: '🔮 사주 분석하기', en: '🔮 Analyze Fortune', ja: '🔮 四柱分析' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    result: { personality: { ko: '성격', en: 'Personality', ja: '性格' }, career: { ko: '직업운', en: 'Career', ja: '仕事運' }, love: { ko: '연애운', en: 'Love', ja: '恋愛運' }, money: { ko: '재물운', en: 'Money', ja: '金運' }, health: { ko: '건강운', en: 'Health', ja: '健康運' }, advice: { ko: '조언', en: 'Advice', ja: 'アドバイス' } },
    disclaimer: { ko: '참고용입니다.', en: 'For reference only.', ja: '参考用です。' }
  },
  'palm-reading': {
    meta: { title: { ko: '손금 보기', en: 'Palm Reading', ja: '手相占い' }, desc: { ko: 'AI 손금 분석', en: 'AI Palm Analysis', ja: 'AI手相分析' } },
    header: { title: { ko: '손금 보기', en: 'Palm Reading', ja: '手相占い' }, subtitle: { ko: '손금으로 알아보는 운세', en: 'Fortune through palm lines', ja: '手相で知る運勢' } },
    lines: { life: { ko: '생명선', en: 'Life Line', ja: '生命線' }, head: { ko: '두뇌선', en: 'Head Line', ja: '頭脳線' }, heart: { ko: '감정선', en: 'Heart Line', ja: '感情線' }, fate: { ko: '운명선', en: 'Fate Line', ja: '運命線' }, marriage: { ko: '결혼선', en: 'Marriage Line', ja: '結婚線' } },
    buttons: { analyze: { ko: '🖐️ 손금 분석하기', en: '🖐️ Analyze Palm', ja: '🖐️ 手相分析' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    disclaimer: { ko: '재미로 즐기는 손금 분석입니다.', en: 'This is for entertainment.', ja: '娯楽用の手相分析です。' }
  },
  'face-reading': {
    meta: { title: { ko: '관상 분석', en: 'Face Reading', ja: '人相占い' }, desc: { ko: 'AI 관상 풀이', en: 'AI Face Analysis', ja: 'AI人相分析' } },
    header: { title: { ko: '관상 분석', en: 'Face Reading', ja: '人相占い' }, subtitle: { ko: '얼굴로 알아보는 운세', en: 'Fortune through face features', ja: '顔で知る運勢' } },
    features: { forehead: { ko: '이마', en: 'Forehead', ja: '額' }, eyes: { ko: '눈', en: 'Eyes', ja: '目' }, nose: { ko: '코', en: 'Nose', ja: '鼻' }, mouth: { ko: '입', en: 'Mouth', ja: '口' }, ears: { ko: '귀', en: 'Ears', ja: '耳' } },
    buttons: { analyze: { ko: '👤 관상 분석하기', en: '👤 Analyze Face', ja: '👤 人相分析' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    disclaimer: { ko: '재미로 즐기는 관상 분석입니다.', en: 'This is for entertainment.', ja: '娯楽用の人相分析です。' }
  },
  'love-style': {
    meta: { title: { ko: '연애 성향 테스트', en: 'Love Style Test', ja: '恋愛スタイルテスト' }, desc: { ko: '나의 연애 스타일 알아보기', en: 'Discover your love style', ja: '私の恋愛スタイルを知る' } },
    header: { title: { ko: '연애 성향 테스트', en: 'Love Style Test', ja: '恋愛スタイルテスト' }, subtitle: { ko: '나는 어떤 연애 스타일일까?', en: 'What is your love style?', ja: 'あなたの恋愛スタイルは？' } },
    buttons: { start: { ko: '시작하기', en: 'Start', ja: '開始' }, next: { ko: '다음', en: 'Next', ja: '次へ' }, result: { ko: '결과 보기', en: 'View Result', ja: '結果を見る' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    result: { yourType: { ko: '당신의 연애 스타일:', en: 'Your Love Style:', ja: 'あなたの恋愛スタイル:' } },
    disclaimer: { ko: '재미로 즐기는 테스트입니다.', en: 'This is for entertainment.', ja: '娯楽用のテストです。' }
  },
  'spirit-animal': {
    meta: { title: { ko: '동물 성격 테스트', en: 'Spirit Animal Test', ja: '動物性格テスト' }, desc: { ko: '나와 닮은 동물 찾기', en: 'Find your spirit animal', ja: '私に似た動物を探す' } },
    header: { title: { ko: '동물 성격 테스트', en: 'Spirit Animal Test', ja: '動物性格テスト' }, subtitle: { ko: '나와 가장 닮은 동물은?', en: 'Which animal are you most like?', ja: '私に一番似た動物は？' } },
    buttons: { start: { ko: '시작하기', en: 'Start', ja: '開始' }, next: { ko: '다음', en: 'Next', ja: '次へ' }, result: { ko: '결과 보기', en: 'View Result', ja: '結果を見る' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    result: { yourAnimal: { ko: '당신의 동물:', en: 'Your Animal:', ja: 'あなたの動物:' } },
    disclaimer: { ko: '재미로 즐기는 테스트입니다.', en: 'This is for entertainment.', ja: '娯楽用のテストです。' }
  },
  'past-life': {
    meta: { title: { ko: '전생 테스트', en: 'Past Life Test', ja: '前世テスト' }, desc: { ko: '나의 전생 알아보기', en: 'Discover your past life', ja: '私の前世を知る' } },
    header: { title: { ko: '전생 테스트', en: 'Past Life Test', ja: '前世テスト' }, subtitle: { ko: '나의 전생은 무엇이었을까?', en: 'What was your past life?', ja: '私の前世は何だったのか？' } },
    buttons: { start: { ko: '시작하기', en: 'Start', ja: '開始' }, next: { ko: '다음', en: 'Next', ja: '次へ' }, result: { ko: '결과 보기', en: 'View Result', ja: '結果を見る' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    result: { yourPastLife: { ko: '당신의 전생:', en: 'Your Past Life:', ja: 'あなたの前世:' } },
    disclaimer: { ko: '재미로 즐기는 테스트입니다.', en: 'This is for entertainment.', ja: '娯楽用のテストです。' }
  },
  'past-life-couple': {
    meta: { title: { ko: '전생의 인연', en: 'Past Life Connection', ja: '前世の縁' }, desc: { ko: '두 사람의 전생 인연', en: 'Past life connection of two', ja: '二人の前世の縁' } },
    header: { title: { ko: '전생의 인연', en: 'Past Life Connection', ja: '前世の縁' }, subtitle: { ko: '두 사람은 전생에 어떤 관계였을까?', en: 'What was your connection in past life?', ja: '二人は前世でどんな関係だった？' } },
    input: { name1: { ko: '첫 번째 사람', en: 'First Person', ja: '一人目' }, name2: { ko: '두 번째 사람', en: 'Second Person', ja: '二人目' } },
    buttons: { check: { ko: '전생 인연 확인', en: 'Check Connection', ja: '前世の縁を確認' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } },
    disclaimer: { ko: '재미로 즐기는 테스트입니다.', en: 'This is for entertainment.', ja: '娯楽用のテストです。' }
  },
  'new-year-2025': {
    meta: { title: { ko: '2025 신년 운세', en: '2025 New Year Fortune', ja: '2025年新年運勢' }, desc: { ko: '2025년 나의 한마디', en: 'My 2025 message', ja: '2025年私へのメッセージ' } },
    header: { title: { ko: '2025 신년 운세', en: '2025 Fortune', ja: '2025年運勢' }, subtitle: { ko: '새해 당신에게 전하는 메시지', en: 'New Year message for you', ja: '新年あなたへのメッセージ' } },
    buttons: { check: { ko: '운세 확인', en: 'Check Fortune', ja: '運勢確認' }, share: { ko: '공유하기', en: 'Share', ja: '共有' }, retry: { ko: '다시 하기', en: 'Try Again', ja: 'もう一度' } }
  },
  'lotto-fortune': {
    meta: { title: { ko: '로또 번호 생성기', en: 'Lotto Number Generator', ja: 'ロト番号生成' }, desc: { ko: '행운의 로또 번호', en: 'Lucky lotto numbers', ja: 'ラッキーロト番号' } },
    header: { title: { ko: '로또 번호 생성기', en: 'Lotto Generator', ja: 'ロト生成' }, subtitle: { ko: '행운의 번호를 받아보세요', en: 'Get your lucky numbers', ja: 'ラッキーナンバーを取得' } },
    buttons: { generate: { ko: '번호 생성', en: 'Generate', ja: '生成' }, save: { ko: '저장', en: 'Save', ja: '保存' }, share: { ko: '공유', en: 'Share', ja: '共有' } },
    disclaimer: { ko: '재미용입니다. 당첨을 보장하지 않습니다.', en: 'For entertainment. No guarantee of winning.', ja: '娯楽用です。当選は保証しません。' }
  },
  'message-generator': {
    meta: { title: { ko: '메시지 생성기', en: 'Message Generator', ja: 'メッセージ生成' }, desc: { ko: '상황별 메시지 생성', en: 'Generate messages', ja: 'メッセージ生成' } },
    header: { title: { ko: '메시지 생성기', en: 'Message Generator', ja: 'メッセージ生成' }, subtitle: { ko: '상황에 맞는 메시지 추천', en: 'Get message recommendations', ja: '状況に合ったメッセージ推薦' } },
    categories: { birthday: { ko: '생일', en: 'Birthday', ja: '誕生日' }, thanks: { ko: '감사', en: 'Thanks', ja: '感謝' }, sorry: { ko: '사과', en: 'Apology', ja: '謝罪' }, cheer: { ko: '응원', en: 'Cheer', ja: '応援' }, love: { ko: '사랑', en: 'Love', ja: '愛' } },
    buttons: { generate: { ko: '생성', en: 'Generate', ja: '生成' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, share: { ko: '공유', en: 'Share', ja: '共有' } }
  },
  'insta-caption': {
    meta: { title: { ko: '인스타 캡션', en: 'Insta Caption', ja: 'インスタキャプション' }, desc: { ko: '인스타그램 캡션 생성', en: 'Generate Instagram captions', ja: 'インスタグラムキャプション生成' } },
    header: { title: { ko: '인스타 캡션', en: 'Insta Caption', ja: 'インスタキャプション' }, subtitle: { ko: '멋진 캡션을 생성하세요', en: 'Generate awesome captions', ja: '素敵なキャプションを生成' } },
    categories: { travel: { ko: '여행', en: 'Travel', ja: '旅行' }, food: { ko: '음식', en: 'Food', ja: '食べ物' }, selfie: { ko: '셀카', en: 'Selfie', ja: 'セルフィー' }, nature: { ko: '자연', en: 'Nature', ja: '自然' }, mood: { ko: '감성', en: 'Mood', ja: '感性' } },
    buttons: { generate: { ko: '생성', en: 'Generate', ja: '生成' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },
  'biorhythm': {
    meta: { title: { ko: '바이오리듬', en: 'Biorhythm', ja: 'バイオリズム' }, desc: { ko: '나의 바이오리듬 확인', en: 'Check your biorhythm', ja: '私のバイオリズム確認' } },
    header: { title: { ko: '바이오리듬', en: 'Biorhythm', ja: 'バイオリズム' }, subtitle: { ko: '오늘의 컨디션 확인', en: 'Check today\'s condition', ja: '今日のコンディション確認' } },
    input: { birthDate: { ko: '생년월일', en: 'Birth Date', ja: '生年月日' } },
    rhythms: { physical: { ko: '신체', en: 'Physical', ja: '身体' }, emotional: { ko: '감성', en: 'Emotional', ja: '感情' }, intellectual: { ko: '지성', en: 'Intellectual', ja: '知性' } },
    buttons: { check: { ko: '확인', en: 'Check', ja: '確認' }, share: { ko: '공유', en: 'Share', ja: '共有' } }
  },
  'char-counter': {
    meta: { title: { ko: '글자수 세기', en: 'Character Counter', ja: '文字数カウント' }, desc: { ko: '글자수 계산', en: 'Count characters', ja: '文字数計算' } },
    header: { title: { ko: '글자수 세기', en: 'Character Counter', ja: '文字数カウント' }, subtitle: { ko: '텍스트의 글자수 확인', en: 'Check text length', ja: 'テキストの文字数確認' } },
    stats: { chars: { ko: '글자 (공백 포함)', en: 'Characters (with spaces)', ja: '文字（空白含む）' }, charsNoSpace: { ko: '글자 (공백 제외)', en: 'Characters (no spaces)', ja: '文字（空白除く）' }, words: { ko: '단어', en: 'Words', ja: '単語' }, sentences: { ko: '문장', en: 'Sentences', ja: '文' }, paragraphs: { ko: '문단', en: 'Paragraphs', ja: '段落' }, bytes: { ko: '바이트', en: 'Bytes', ja: 'バイト' } },
    buttons: { clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },
  'ladder-game': {
    meta: { title: { ko: '사다리 게임', en: 'Ladder Game', ja: 'はしごゲーム' }, desc: { ko: '사다리 타기', en: 'Ladder climbing game', ja: 'はしごゲーム' } },
    header: { title: { ko: '사다리 게임', en: 'Ladder Game', ja: 'はしごゲーム' }, subtitle: { ko: '공정한 추첨을 위한 사다리 타기', en: 'Fair lottery with ladder game', ja: '公平な抽選のためのはしごゲーム' } },
    input: { participants: { ko: '참가자', en: 'Participants', ja: '参加者' }, results: { ko: '결과', en: 'Results', ja: '結果' } },
    buttons: { generate: { ko: '사다리 생성', en: 'Generate', ja: 'はしご生成' }, start: { ko: '시작', en: 'Start', ja: '開始' }, reset: { ko: '리셋', en: 'Reset', ja: 'リセット' } }
  },
  'random-picker': {
    meta: { title: { ko: '랜덤 뽑기', en: 'Random Picker', ja: 'ランダムピッカー' }, desc: { ko: '무작위 선택', en: 'Random selection', ja: 'ランダム選択' } },
    header: { title: { ko: '랜덤 뽑기', en: 'Random Picker', ja: 'ランダムピッカー' }, subtitle: { ko: '무작위로 하나를 선택하세요', en: 'Pick one randomly', ja: 'ランダムに一つ選択' } },
    input: { items: { ko: '항목 (줄바꿈으로 구분)', en: 'Items (separate by line)', ja: '項目（改行で区切り）' } },
    buttons: { pick: { ko: '뽑기', en: 'Pick', ja: '選ぶ' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } },
    result: { selected: { ko: '선택됨:', en: 'Selected:', ja: '選択:' } }
  },
  'gpa-calculator': {
    meta: { title: { ko: '학점 계산기', en: 'GPA Calculator', ja: '成績計算機' }, desc: { ko: '학점 평균 계산', en: 'Calculate GPA', ja: 'GPA計算' } },
    header: { title: { ko: '학점 계산기', en: 'GPA Calculator', ja: '成績計算機' }, subtitle: { ko: '평균 학점 계산', en: 'Calculate average GPA', ja: '平均成績計算' } },
    input: { subject: { ko: '과목명', en: 'Subject', ja: '科目名' }, credits: { ko: '학점', en: 'Credits', ja: '単位' }, grade: { ko: '성적', en: 'Grade', ja: '成績' } },
    buttons: { add: { ko: '과목 추가', en: 'Add Subject', ja: '科目追加' }, calculate: { ko: '계산', en: 'Calculate', ja: '計算' }, clear: { ko: '초기화', en: 'Clear', ja: 'クリア' } },
    result: { gpa: { ko: '평균 학점', en: 'GPA', ja: 'GPA' }, totalCredits: { ko: '총 학점', en: 'Total Credits', ja: '総単位' } }
  },
  'name-generator': {
    meta: { title: { ko: '랜덤 이름 생성', en: 'Random Name Generator', ja: 'ランダム名前生成' }, desc: { ko: '무작위 이름 생성', en: 'Generate random names', ja: 'ランダムな名前を生成' } },
    header: { title: { ko: '랜덤 이름 생성', en: 'Name Generator', ja: '名前生成' }, subtitle: { ko: '무작위 이름을 생성하세요', en: 'Generate random names', ja: 'ランダムな名前を生成' } },
    options: { gender: { ko: '성별', en: 'Gender', ja: '性別' }, male: { ko: '남성', en: 'Male', ja: '男性' }, female: { ko: '여성', en: 'Female', ja: '女性' }, any: { ko: '무관', en: 'Any', ja: '無関係' }, country: { ko: '국가', en: 'Country', ja: '国' } },
    buttons: { generate: { ko: '생성', en: 'Generate', ja: '生成' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },

  // === 웹 도구 (Web Tools) ===
  'word-counter': {
    meta: { title: { ko: '단어 수 세기', en: 'Word Counter', ja: '単語カウンター' }, desc: { ko: '단어/문장 수 계산', en: 'Count words/sentences', ja: '単語/文の数を計算' } },
    header: { title: { ko: '단어 수 세기', en: 'Word Counter', ja: '単語カウンター' }, subtitle: { ko: '텍스트 분석 도구', en: 'Text analysis tool', ja: 'テキスト分析ツール' } },
    stats: { words: { ko: '단어', en: 'Words', ja: '単語' }, chars: { ko: '글자', en: 'Characters', ja: '文字' }, sentences: { ko: '문장', en: 'Sentences', ja: '文' }, paragraphs: { ko: '문단', en: 'Paragraphs', ja: '段落' }, readingTime: { ko: '읽기 시간', en: 'Reading Time', ja: '読書時間' } },
    buttons: { clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },
  'regex-tester': {
    meta: { title: { ko: '정규식 테스터', en: 'Regex Tester', ja: '正規表現テスター' }, desc: { ko: '정규표현식 테스트', en: 'Test regular expressions', ja: '正規表現テスト' } },
    header: { title: { ko: '정규식 테스터', en: 'Regex Tester', ja: '正規表現テスター' }, subtitle: { ko: '정규표현식을 테스트하세요', en: 'Test your regular expressions', ja: '正規表現をテスト' } },
    input: { pattern: { ko: '패턴', en: 'Pattern', ja: 'パターン' }, flags: { ko: '플래그', en: 'Flags', ja: 'フラグ' }, testString: { ko: '테스트 문자열', en: 'Test String', ja: 'テスト文字列' } },
    result: { matches: { ko: '매치', en: 'Matches', ja: 'マッチ' }, noMatch: { ko: '매치 없음', en: 'No Match', ja: 'マッチなし' } },
    buttons: { test: { ko: '테스트', en: 'Test', ja: 'テスト' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } }
  },
  'jwt-decoder': {
    meta: { title: { ko: 'JWT 디코더', en: 'JWT Decoder', ja: 'JWTデコーダー' }, desc: { ko: 'JWT 토큰 분석', en: 'Decode JWT tokens', ja: 'JWTトークン分析' } },
    header: { title: { ko: 'JWT 디코더', en: 'JWT Decoder', ja: 'JWTデコーダー' }, subtitle: { ko: 'JWT 토큰을 분석하세요', en: 'Analyze JWT tokens', ja: 'JWTトークンを分析' } },
    input: { token: { ko: 'JWT 토큰', en: 'JWT Token', ja: 'JWTトークン' }, placeholder: { ko: '토큰을 입력하세요', en: 'Enter token', ja: 'トークンを入力' } },
    result: { header: { ko: '헤더', en: 'Header', ja: 'ヘッダー' }, payload: { ko: '페이로드', en: 'Payload', ja: 'ペイロード' }, signature: { ko: '서명', en: 'Signature', ja: '署名' }, expired: { ko: '만료됨', en: 'Expired', ja: '期限切れ' }, valid: { ko: '유효', en: 'Valid', ja: '有効' } },
    buttons: { decode: { ko: '디코딩', en: 'Decode', ja: 'デコード' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } }
  },
  'diff-checker': {
    meta: { title: { ko: '텍스트 비교', en: 'Diff Checker', ja: 'テキスト比較' }, desc: { ko: '두 텍스트 비교', en: 'Compare two texts', ja: '二つのテキストを比較' } },
    header: { title: { ko: '텍스트 비교', en: 'Diff Checker', ja: 'テキスト比較' }, subtitle: { ko: '두 텍스트의 차이를 확인하세요', en: 'Find differences between texts', ja: '二つのテキストの違いを確認' } },
    input: { original: { ko: '원본 텍스트', en: 'Original Text', ja: '元テキスト' }, modified: { ko: '비교 텍스트', en: 'Modified Text', ja: '比較テキスト' } },
    result: { added: { ko: '추가됨', en: 'Added', ja: '追加' }, removed: { ko: '삭제됨', en: 'Removed', ja: '削除' }, unchanged: { ko: '변경없음', en: 'Unchanged', ja: '変更なし' } },
    buttons: { compare: { ko: '비교하기', en: 'Compare', ja: '比較' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' }, swap: { ko: '교체', en: 'Swap', ja: '入替' } }
  },
  'pomodoro-timer': {
    meta: { title: { ko: '뽀모도로 타이머', en: 'Pomodoro Timer', ja: 'ポモドーロタイマー' }, desc: { ko: '집중력 타이머', en: 'Focus timer', ja: '集中タイマー' } },
    header: { title: { ko: '뽀모도로 타이머', en: 'Pomodoro Timer', ja: 'ポモドーロタイマー' }, subtitle: { ko: '집중과 휴식을 관리하세요', en: 'Manage focus and breaks', ja: '集中と休憩を管理' } },
    modes: { work: { ko: '집중', en: 'Focus', ja: '集中' }, shortBreak: { ko: '짧은 휴식', en: 'Short Break', ja: '短い休憩' }, longBreak: { ko: '긴 휴식', en: 'Long Break', ja: '長い休憩' } },
    settings: { workTime: { ko: '집중 시간', en: 'Work Time', ja: '集中時間' }, shortBreakTime: { ko: '짧은 휴식', en: 'Short Break', ja: '短い休憩' }, longBreakTime: { ko: '긴 휴식', en: 'Long Break', ja: '長い休憩' }, rounds: { ko: '라운드', en: 'Rounds', ja: 'ラウンド' } },
    buttons: { start: { ko: '시작', en: 'Start', ja: '開始' }, pause: { ko: '일시정지', en: 'Pause', ja: '一時停止' }, reset: { ko: '리셋', en: 'Reset', ja: 'リセット' }, skip: { ko: '건너뛰기', en: 'Skip', ja: 'スキップ' } },
    status: { completed: { ko: '완료', en: 'Completed', ja: '完了' }, sessions: { ko: '세션', en: 'Sessions', ja: 'セッション' } }
  },
  'slug-generator': {
    meta: { title: { ko: 'URL 슬러그 생성기', en: 'Slug Generator', ja: 'スラッグ生成' }, desc: { ko: 'URL 슬러그 생성', en: 'Generate URL slugs', ja: 'URLスラッグ生成' } },
    header: { title: { ko: 'URL 슬러그 생성기', en: 'Slug Generator', ja: 'スラッグ生成' }, subtitle: { ko: 'URL에 사용할 슬러그 생성', en: 'Generate slugs for URLs', ja: 'URL用のスラッグ生成' } },
    input: { text: { ko: '텍스트', en: 'Text', ja: 'テキスト' }, placeholder: { ko: '텍스트를 입력하세요', en: 'Enter text', ja: 'テキストを入力' } },
    options: { lowercase: { ko: '소문자', en: 'Lowercase', ja: '小文字' }, separator: { ko: '구분자', en: 'Separator', ja: '区切り' } },
    buttons: { generate: { ko: '생성', en: 'Generate', ja: '生成' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },
  'ip-info': {
    meta: { title: { ko: 'IP 정보', en: 'IP Info', ja: 'IP情報' }, desc: { ko: 'IP 주소 정보', en: 'IP address info', ja: 'IPアドレス情報' } },
    header: { title: { ko: 'IP 정보', en: 'IP Info', ja: 'IP情報' }, subtitle: { ko: '나의 IP 주소 정보', en: 'My IP address info', ja: '私のIPアドレス情報' } },
    info: { ip: { ko: 'IP 주소', en: 'IP Address', ja: 'IPアドレス' }, location: { ko: '위치', en: 'Location', ja: '位置' }, isp: { ko: 'ISP', en: 'ISP', ja: 'ISP' }, timezone: { ko: '시간대', en: 'Timezone', ja: 'タイムゾーン' } },
    buttons: { refresh: { ko: '새로고침', en: 'Refresh', ja: '更新' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },
  'emoji-picker': {
    meta: { title: { ko: '이모지 선택', en: 'Emoji Picker', ja: '絵文字ピッカー' }, desc: { ko: '이모지 찾기 및 복사', en: 'Find and copy emojis', ja: '絵文字を検索してコピー' } },
    header: { title: { ko: '이모지 선택', en: 'Emoji Picker', ja: '絵文字ピッカー' }, subtitle: { ko: '이모지를 찾아 복사하세요', en: 'Find and copy emojis', ja: '絵文字を探してコピー' } },
    categories: { smileys: { ko: '표정', en: 'Smileys', ja: '顔' }, people: { ko: '사람', en: 'People', ja: '人' }, animals: { ko: '동물', en: 'Animals', ja: '動物' }, food: { ko: '음식', en: 'Food', ja: '食べ物' }, travel: { ko: '여행', en: 'Travel', ja: '旅行' }, objects: { ko: '물건', en: 'Objects', ja: '物' }, symbols: { ko: '기호', en: 'Symbols', ja: '記号' }, flags: { ko: '국기', en: 'Flags', ja: '旗' } },
    search: { placeholder: { ko: '이모지 검색...', en: 'Search emojis...', ja: '絵文字を検索...' } },
    copied: { ko: '복사됨!', en: 'Copied!', ja: 'コピー完了！' }
  },
  'text-case-converter': {
    meta: { title: { ko: '텍스트 변환', en: 'Text Case Converter', ja: 'テキストケース変換' }, desc: { ko: '대소문자 변환', en: 'Convert text case', ja: '大小文字変換' } },
    header: { title: { ko: '텍스트 변환', en: 'Text Case Converter', ja: 'テキストケース変換' }, subtitle: { ko: '텍스트 대소문자 변환', en: 'Convert text case', ja: 'テキストの大小文字変換' } },
    cases: { upper: { ko: '대문자', en: 'UPPERCASE', ja: '大文字' }, lower: { ko: '소문자', en: 'lowercase', ja: '小文字' }, title: { ko: '제목형', en: 'Title Case', ja: 'タイトルケース' }, sentence: { ko: '문장형', en: 'Sentence case', ja: '文ケース' }, camel: { ko: '카멜', en: 'camelCase', ja: 'キャメルケース' }, pascal: { ko: '파스칼', en: 'PascalCase', ja: 'パスカルケース' }, snake: { ko: '스네이크', en: 'snake_case', ja: 'スネークケース' }, kebab: { ko: '케밥', en: 'kebab-case', ja: 'ケバブケース' } },
    buttons: { convert: { ko: '변환', en: 'Convert', ja: '変換' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } }
  },
  'meta-tag-generator': {
    meta: { title: { ko: '메타 태그 생성', en: 'Meta Tag Generator', ja: 'メタタグ生成' }, desc: { ko: 'SEO 메타 태그 생성', en: 'Generate SEO meta tags', ja: 'SEOメタタグ生成' } },
    header: { title: { ko: '메타 태그 생성', en: 'Meta Tag Generator', ja: 'メタタグ生成' }, subtitle: { ko: 'SEO를 위한 메타 태그 생성', en: 'Generate meta tags for SEO', ja: 'SEO用メタタグ生成' } },
    input: { title: { ko: '페이지 제목', en: 'Page Title', ja: 'ページタイトル' }, description: { ko: '설명', en: 'Description', ja: '説明' }, keywords: { ko: '키워드', en: 'Keywords', ja: 'キーワード' }, author: { ko: '작성자', en: 'Author', ja: '作成者' }, image: { ko: 'OG 이미지 URL', en: 'OG Image URL', ja: 'OG画像URL' }, url: { ko: 'URL', en: 'URL', ja: 'URL' } },
    options: { og: { ko: 'Open Graph 태그', en: 'Open Graph Tags', ja: 'Open Graphタグ' }, twitter: { ko: 'Twitter 카드', en: 'Twitter Cards', ja: 'Twitterカード' } },
    buttons: { generate: { ko: '생성', en: 'Generate', ja: '生成' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' } }
  },
  'json-to-typescript': {
    meta: { title: { ko: 'JSON→TypeScript', en: 'JSON to TypeScript', ja: 'JSON→TypeScript' }, desc: { ko: 'JSON을 TypeScript로 변환', en: 'Convert JSON to TypeScript', ja: 'JSONをTypeScriptに変換' } },
    header: { title: { ko: 'JSON → TypeScript', en: 'JSON → TypeScript', ja: 'JSON → TypeScript' }, subtitle: { ko: 'JSON을 TypeScript 타입으로 변환', en: 'Convert JSON to TypeScript types', ja: 'JSONをTypeScript型に変換' } },
    input: { json: { ko: 'JSON 입력', en: 'JSON Input', ja: 'JSON入力' }, placeholder: { ko: 'JSON을 입력하세요', en: 'Enter JSON', ja: 'JSONを入力' } },
    options: { interfaceName: { ko: '인터페이스 이름', en: 'Interface Name', ja: 'インターフェース名' }, exportType: { ko: 'Export 타입', en: 'Export Type', ja: 'Exportタイプ' } },
    buttons: { convert: { ko: '변환', en: 'Convert', ja: '変換' }, copy: { ko: '복사', en: 'Copy', ja: 'コピー' }, clear: { ko: '지우기', en: 'Clear', ja: 'クリア' } }
  }
};
