'use strict';

module.exports = {
  'age-calculator': {
    meta: {
      title: { ko: '나이 계산기 - 만 나이 & 한국 나이', en: 'Age Calculator - International & Korean Age', ja: '年齢計算機 - 満年齢 & 韓国年齢' },
      desc: { ko: '생년월일을 입력하면 만 나이와 한국 나이를 자동으로 계산해드립니다.', en: 'Calculate your international and Korean age instantly.', ja: '生年月日を入力すると、満年齢と韓国年齢を自動的に計算します。' }
    },
    header: {
      title: { ko: '🎂 나이 계산기', en: '🎂 Age Calculator', ja: '🎂 年齢計算機' },
      subtitle: { ko: '만 나이와 한국 나이를 한번에 확인하세요', en: 'Check your International and Korean age at once', ja: '満年齢と韓国年齢を一度に確認' }
    },
    input: {
      label: { ko: '생년월일을 선택하세요', en: 'Select your birth date', ja: '生年月日を選択してください' },
      btn: { ko: '나이 계산하기', en: 'Calculate Age', ja: '年齢を計算する' }
    },
    result: {
      intAge: { ko: '만 나이', en: 'International Age', ja: '満年齢' },
      korAge: { ko: '한국 나이', en: 'Korean Age', ja: '韓国年齢' },
      nextBirth: { ko: '다음 생일까지', en: 'Next Birthday', ja: '次の誕生日まで' },
      daysLeft: { ko: '일 남음', en: 'days left', ja: '日残り' },
      zodiac: { ko: '띠', en: 'Zodiac', ja: '干支' },
      constellation: { ko: '별자리', en: 'Constellation', ja: '星座' },
      dayOfWeek: { ko: '태어난 요일', en: 'Day of Birth', ja: '生まれた曜日' },
      daysLived: { ko: '살아온 일수', en: 'Days Lived', ja: '生きてきた日数' },
      days: { ko: '일', en: 'days', ja: '日' }
    },
    info: {
      title: { ko: '📌 2023년부터 만 나이 통일', en: '📌 "International Age" Standard in Korea', ja: '📌 2023年から満年齢統一' },
      desc: { ko: '대한민국은 2023년 6월 28일부터 법적으로 "만 나이"를 사용합니다. 일상에서도 만 나이 사용이 권장됩니다.', en: 'South Korea officially adopted the "International Age" system on June 28, 2023.', ja: '大韓民国は2023年6月28日から法的に「満年齢」を使用します。' }
    },
    share: { ko: '결과 공유하기', en: 'Share Result', ja: '結果を共有する' },
    disclaimer: { ko: '이 도구는 참고용이며, 법적 효력이 없습니다.', en: 'This tool is for reference only.', ja: 'このツールは参考用であり、法的効力はありません。' }
  },
  'json-formatter': {
    meta: {
      title: { ko: 'JSON 포맷터 & 뷰어', en: 'JSON Formatter & Viewer', ja: 'JSONフォーマッター & ビューアー' },
      desc: { ko: 'JSON 데이터를 즉시 정렬하고 검증하세요', en: 'Format and validate JSON data instantly', ja: 'JSONデータを即座に整形して検証します' }
    },
    header: {
      title: { ko: 'JSON 포맷터 & 뷰어', en: 'JSON Formatter & Viewer', ja: 'JSONフォーマッター & ビューアー' },
      subtitle: { ko: 'JSON 데이터를 즉시 정렬하고 검증하세요', en: 'Format and validate JSON data instantly', ja: 'JSONデータを即座に整形して検証します' }
    },
    options: {
      indent: { ko: '들여쓰기:', en: 'Indent:', ja: 'インデント:' },
      view: { ko: '보기:', en: 'View:', ja: '表示:' }
    },
    controls: {
      format: { ko: 'JSON 정렬', en: 'Format JSON', ja: 'JSON整形' },
      minify: { ko: '압축', en: 'Minify', ja: '圧縮' },
      validate: { ko: '검증', en: 'Validate', ja: '検証' },
      clear: { ko: '지우기', en: 'Clear', ja: 'クリア' },
      sample: { ko: '샘플 로드', en: 'Load Sample', ja: 'サンプル読込' }
    },
    panel: {
      input: { ko: '입력 JSON', en: 'Input JSON', ja: '入力JSON' },
      paste: { ko: '붙여넣기', en: 'Paste', ja: '貼り付け' },
      placeholder: { ko: '여기에 JSON을 붙여넣으세요...', en: 'Paste your JSON here...', ja: 'ここにJSONを貼り付けてください...' },
      output: { ko: '출력', en: 'Output', ja: '出力' },
      copy: { ko: '복사', en: 'Copy', ja: 'コピー' },
      download: { ko: '다운로드', en: 'Download', ja: 'ダウンロード' },
      ready: { ko: '준비됨', en: 'Ready', ja: '準備完了' },
      valid: { ko: '유효한 JSON', en: 'Valid JSON', ja: '有効なJSON' },
      invalid: { ko: '유효하지 않은 JSON', en: 'Invalid JSON', ja: '無効なJSON' }
    },
    features: {
      f1: { title: { ko: '정렬 & 뷰티파이', en: 'Format & Beautify', ja: '整形 & ビューティファイ' }, desc: { ko: '원하는 들여쓰기로 JSON을 예쁘게 정렬', en: 'Pretty print JSON with customizable indentation', ja: '好みのインデントでJSONを綺麗に整形' } },
      f2: { title: { ko: 'JSON 검증', en: 'Validate JSON', ja: 'JSON検証' }, desc: { ko: '상세한 오류 메시지로 JSON 유효성 검사', en: 'Check if your JSON is valid with error messages', ja: '詳細なエラーメッセージでJSONの有効性を確認' } },
      f3: { title: { ko: '구문 강조', en: 'Syntax Highlighting', ja: 'シンタックスハイライト' }, desc: { ko: '읽기 쉬운 색상 코드 출력', en: 'Color-coded output for easy reading', ja: '読みやすいカラーコード出力' } },
      f4: { title: { ko: '압축', en: 'Minify', ja: '圧縮' }, desc: { ko: '공백을 제거하여 JSON 압축', en: 'Compress JSON by removing whitespace', ja: '空白を削除してJSONを圧縮' } }
    },
    footer: { ko: '무료 JSON 포맷터 도구 | 서버로 데이터가 전송되지 않습니다', en: 'Free JSON Formatter Tool | No data is sent to server', ja: '無料JSONフォーマッターツール | データはサーバーに送信されません' },
    messages: {
      copied: { ko: '클립보드에 복사되었습니다!', en: 'Copied to clipboard!', ja: 'クリップボードにコピーしました！' },
      downloaded: { ko: '다운로드 완료!', en: 'Downloaded!', ja: 'ダウンロード完了！' },
      pasted: { ko: '클립보드에서 붙여넣기 완료!', en: 'Pasted from clipboard!', ja: 'クリップボードから貼り付け完了！' },
      emptyCopy: { ko: '복사할 내용이 없습니다', en: 'Nothing to copy', ja: 'コピーする内容がありません' },
      emptyDownload: { ko: '다운로드할 내용이 없습니다', en: 'Nothing to download', ja: 'ダウンロードする内容がありません' },
      enterJson: { ko: 'JSON을 입력하세요', en: 'Please enter JSON', ja: 'JSONを入力してください' },
      invalid: { ko: '유효하지 않은 JSON!', en: 'Invalid JSON!', ja: '無効なJSON！' }
    }
  },
  'daily-fortune': {
    meta: {
      title: { ko: '오늘의 운세 - AI 무료 운세', en: 'Daily Fortune - Free AI Horoscope', ja: '今日の運勢 - AI無料占い' },
      desc: { ko: '별자리, 띠, 혈액형으로 오늘의 운세를 무료로 확인하세요.', en: 'Check your daily horoscope by zodiac, sign, or blood type for free.', ja: '星座、干支、血液型で今日の運勢を無料で確認してください。' }
    },
    header: {
      title: { ko: '오늘의 운세', en: 'Daily Fortune', ja: '今日の運勢' },
      subtitle: { ko: 'AI가 분석하는 나만의 데일리 운세', en: 'Personalized daily fortune analyzed by AI', ja: 'AIが分析するあなただけのデイリー運勢' }
    },
    tabs: {
      zodiac: { ko: '별자리', en: 'Zodiac', ja: '星座' },
      chinese: { ko: '띠', en: 'Sign', ja: '干支' },
      blood: { ko: '혈액형', en: 'Blood Type', ja: '血液型' }
    },
    ui: {
      selectType: { ko: '🌙 운세 유형 선택', en: '🌙 Select Type', ja: '🌙 占いタイプ選択' },
      generate: { ko: '🔮 오늘의 운세 보기', en: '🔮 View Daily Fortune', ja: '🔮 今日の運勢を見る' },
      loading: { ko: '운세를 점치는 중...', en: 'Reading your fortune...', ja: '運勢を占っています...' },
      overall: { ko: '오늘의 운세', en: 'Overall Luck', ja: '今日の運勢' },
      mainTitle: { ko: '✨ 오늘의 총운', en: '✨ Overall Fortune', ja: '✨ 今日の総運' },
      copy: { ko: '📋 복사하기', en: '📋 Copy', ja: '📋 コピー' },
      share: { ko: '📤 공유하기', en: '📤 Share', ja: '📤 共有' },
      retry: { ko: '🔄 다시 보기', en: '🔄 Try Again', ja: '🔄 もう一度' },
      footer: { ko: '운세는 재미로만 봐주세요 😊', en: 'For entertainment purposes only 😊', ja: '占いは楽しみとして見てください 😊' }
    },
    categories: {
      love: { ko: '애정운', en: 'Love', ja: '恋愛運' },
      money: { ko: '금전운', en: 'Money', ja: '金運' },
      work: { ko: '직장/학업운', en: 'Work/Study', ja: '仕事/学業' },
      health: { ko: '건강운', en: 'Health', ja: '健康運' }
    },
    advice: {
      number: { ko: '행운의 숫자', en: 'Lucky Number', ja: 'ラッキーナンバー' },
      color: { ko: '행운의 색', en: 'Lucky Color', ja: 'ラッキーカラー' },
      direction: { ko: '행운의 방향', en: 'Lucky Direction', ja: 'ラッキーな方向' },
      tip: { ko: '오늘의 조언', en: 'Daily Tip', ja: '今日のアドバイス' }
    }
  },
  'mbti-test': {
    meta: {
      title: { ko: 'MBTI 성격 유형 테스트', en: 'MBTI Personality Test', ja: 'MBTI性格タイプテスト' },
      desc: { ko: '12문항으로 빠르게 알아보는 나의 MBTI', en: 'Discover your MBTI type in 12 questions', ja: '12問で素早く分かる私のMBTI' }
    },
    ui: {
      title: { ko: 'MBTI 성격 유형 테스트', en: 'MBTI Personality Test', ja: 'MBTI性格タイプテスト' },
      subtitle: { ko: '12문항으로 알아보는 나의 성격 유형', en: 'Find out your personality type with 12 questions', ja: '12問で分かる私の性格タイプ' },
      introTitle: { ko: '나의 MBTI는 무엇일까?', en: 'What is my MBTI?', ja: '私のMBTIは何？' },
      introDesc: { 
        ko: '간단한 12문항으로 나의 성격 유형을 알아보세요!\n너무 오래 고민하지 말고, 직관적으로 답해주세요.', 
        en: 'Discover your personality type with 12 simple questions!\nDon\'t overthink it, answer intuitively.', 
        ja: '簡単な12問で私の性格タイプを調べてみましょう！\nあまり長く悩まず、直感的に答えてください。' 
      },
      startBtn: { ko: '테스트 시작하기', en: 'Start Test', ja: 'テスト開始' },
      prevBtn: { ko: '이전', en: 'Prev', ja: '前へ' },
      nextBtn: { ko: '다음', en: 'Next', ja: '次へ' },
      resultBtn: { ko: '결과 보기', en: 'View Result', ja: '結果を見る' },
      yourType: { ko: '당신의 MBTI 유형은', en: 'Your MBTI Type is', ja: 'あなたのMBTIタイプは' },
      features: { ko: '성격 특징', en: 'Personality Traits', ja: '性格の特徴' },
      compatibility: { ko: '궁합이 좋은 유형', en: 'Compatible Types', ja: '相性の良いタイプ' },
      share: { ko: '결과 공유하기', en: 'Share Result', ja: '結果を共有する' },
      retry: { ko: '다시 테스트하기', en: 'Retake Test', ja: 'もう一度テストする' },
      footer: { ko: '이 테스트는 재미를 위한 간이 테스트입니다.', en: 'This is a simple test for entertainment.', ja: 'このテストは楽しみのための簡易テストです。' }
    },
    questions: {
      ko: [
        { text: "주말에 에너지를 충전하는 방법은?", options: [{ text: "친구들과 만나서 수다 떨기", value: "E" }, { text: "집에서 혼자 휴식하기", value: "I" }] },
        { text: "새로운 사람들을 만났을 때 나는?", options: [{ text: "먼저 말을 걸고 대화를 시작함", value: "E" }, { text: "상대가 먼저 다가오길 기다림", value: "I" }] },
        { text: "생각을 정리할 때 선호하는 방식은?", options: [{ text: "누군가와 대화하면서 정리", value: "E" }, { text: "혼자 조용히 생각하면서 정리", value: "I" }] },
        { text: "어떤 정보를 더 신뢰하는 편인가요?", options: [{ text: "직접 경험하거나 확인된 사실", value: "S" }, { text: "직감이나 가능성, 숨겨진 의미", value: "N" }] },
        { text: "새로운 것을 배울 때 나는?", options: [{ text: "단계별로 순서대로 배움", value: "S" }, { text: "전체 그림을 먼저 파악함", value: "N" }] },
        { text: "대화할 때 주로 어떤 이야기를 하나요?", options: [{ text: "실제 있었던 일, 구체적인 사실", value: "S" }, { text: "아이디어, 가능성, 상상", value: "N" }] },
        { text: "결정을 내릴 때 더 중요하게 생각하는 것은?", options: [{ text: "논리적으로 옳은 것", value: "T" }, { text: "관계와 감정에 미치는 영향", value: "F" }] },
        { text: "친구가 고민을 이야기할 때 나는?", options: [{ text: "해결책을 제시해준다", value: "T" }, { text: "공감하고 들어준다", value: "F" }] },
        { text: "의견 충돌이 있을 때 나는?", options: [{ text: "내 의견이 맞다면 끝까지 주장", value: "T" }, { text: "관계를 위해 양보할 수 있음", value: "F" }] },
        { text: "여행을 갈 때 나는?", options: [{ text: "미리 계획을 세워서 간다", value: "J" }, { text: "즉흥적으로 결정한다", value: "P" }] },
        { text: "마감이 있는 일을 할 때 나는?", options: [{ text: "미리미리 끝내놓는다", value: "J" }, { text: "마감 직전에 집중해서 한다", value: "P" }] },
        { text: "일상생활에서 나는?", options: [{ text: "규칙적인 루틴을 좋아함", value: "J" }, { text: "유연하고 자유로운 것을 좋아함", value: "P" }] }
      ],
      en: [
        { text: "How do you recharge on weekends?", options: [{ text: "Hanging out with friends", value: "E" }, { text: "Relaxing alone at home", value: "I" }] },
        { text: "When meeting new people, I...", options: [{ text: "Start the conversation first", value: "E" }, { text: "Wait for them to approach me", value: "I" }] },
        { text: "How do you organize your thoughts?", options: [{ text: "Talking with someone", value: "E" }, { text: "Thinking quietly alone", value: "I" }] },
        { text: "What info do you trust more?", options: [{ text: "Facts and experiences", value: "S" }, { text: "Intuition and possibilities", value: "N" }] },
        { text: "When learning something new...", options: [{ text: "Step-by-step", value: "S" }, { text: "Grasp the big picture first", value: "N" }] },
        { text: "In conversations, I talk about...", options: [{ text: "Concrete facts and events", value: "S" }, { text: "Ideas and imagination", value: "N" }] },
        { text: "When making decisions...", options: [{ text: "Logic and truth", value: "T" }, { text: "Feelings and harmony", value: "F" }] },
        { text: "When a friend has a problem...", options: [{ text: "I offer solutions", value: "T" }, { text: "I offer empathy", value: "F" }] },
        { text: "In a conflict...", options: [{ text: "I stand by logic", value: "T" }, { text: "I value relationships", value: "F" }] },
        { text: "When traveling...", options: [{ text: "I plan everything", value: "J" }, { text: "I decide spontaneously", value: "P" }] },
        { text: "With deadlines...", options: [{ text: "I finish early", value: "J" }, { text: "I work at the last minute", value: "P" }] },
        { text: "In daily life...", options: [{ text: "I like routines", value: "J" }, { text: "I like flexibility", value: "P" }] }
      ],
      ja: [
        { text: "週末のエネルギー充電方法は？", options: [{ text: "友達と会って話す", value: "E" }, { text: "家で一人で休む", value: "I" }] },
        { text: "新しい人に会った時、私は...", options: [{ text: "先に話しかける", value: "E" }, { text: "相手が来るのを待つ", value: "I" }] },
        { text: "考えを整理する時は...", options: [{ text: "誰かと話しながら整理", value: "E" }, { text: "一人で静かに考える", value: "I" }] },
        { text: "どの情報をより信頼しますか？", options: [{ text: "経験や事実", value: "S" }, { text: "直感や可能性", value: "N" }] },
        { text: "新しいことを学ぶ時...", options: [{ text: "段階的に学ぶ", value: "S" }, { text: "全体像を先に把握", value: "N" }] },
        { text: "会話では主に...", options: [{ text: "具体的な事実", value: "S" }, { text: "アイデアや想像", value: "N" }] },
        { text: "決定を下す時...", options: [{ text: "論理的に正しいこと", value: "T" }, { text: "感情や調和", value: "F" }] },
        { text: "友達が悩んでいる時...", options: [{ text: "解決策を提案する", value: "T" }, { text: "共感して聞く", value: "F" }] },
        { text: "意見が対立した時...", options: [{ text: "論理を主張する", value: "T" }, { text: "関係のために譲る", value: "F" }] },
        { text: "旅行に行く時...", options: [{ text: "計画を立てる", value: "J" }, { text: "即興で決める", value: "P" }] },
        { text: "締め切りがある時...", options: [{ text: "早めに終わらせる", value: "J" }, { text: "直前に集中する", value: "P" }] },
        { text: "日常生活では...", options: [{ text: "ルーチンが好き", value: "J" }, { text: "柔軟性が好き", value: "P" }] }
      ]
    }
  }
};