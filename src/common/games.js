'use strict';

// 게임 목록 (다국어)
var games = [
  {
    id: 'reaction-time',
    title: { ko: '순발력 테스트', en: 'Reaction Time Test', ja: '反射神経テスト' },
    description: { ko: '당신의 반응 속도를 측정해보세요!', en: 'Test your reaction speed!', ja: '反応速度を測定しましょう！' },
    emoji: '⚡',
    category: 'reaction'
  },
  {
    id: 'memory-number',
    title: { ko: '숫자 기억력', en: 'Number Memory', ja: '数字記憶' },
    description: { ko: '점점 길어지는 숫자를 기억하세요!', en: 'Remember increasingly long numbers!', ja: 'どんどん長くなる数字を覚えよう！' },
    emoji: '🧠',
    category: 'memory'
  },
  {
    id: 'typing-speed',
    title: { ko: '타이핑 속도', en: 'Typing Speed', ja: 'タイピング速度' },
    description: { ko: '당신의 타이핑 속도를 측정하세요!', en: 'Measure your typing speed!', ja: 'タイピング速度を測定しよう！' },
    emoji: '⌨️',
    category: 'speed'
  },
  {
    id: 'color-match',
    title: { ko: '색깔 맞추기', en: 'Color Match', ja: '色合わせ' },
    description: { ko: '글자와 색깔이 일치하는지 판단하세요!', en: 'Match the text with its color!', ja: '文字と色が一致するか判断しよう！' },
    emoji: '🎨',
    category: 'focus'
  },
  {
    id: 'math-quiz',
    title: { ko: '암산 게임', en: 'Math Quiz', ja: '暗算ゲーム' },
    description: { ko: '빠르게 수학 문제를 풀어보세요!', en: 'Solve math problems quickly!', ja: '素早く数学問題を解こう！' },
    emoji: '🔢',
    category: 'brain'
  },
  {
    id: 'pattern-memory',
    title: { ko: '패턴 기억', en: 'Pattern Memory', ja: 'パターン記憶' },
    description: { ko: '패턴을 기억하고 따라하세요!', en: 'Remember and repeat patterns!', ja: 'パターンを覚えて真似しよう！' },
    emoji: '🔲',
    category: 'memory'
  },
  {
    id: 'click-speed',
    title: { ko: '클릭 속도', en: 'Click Speed', ja: 'クリック速度' },
    description: { ko: '10초 동안 최대한 많이 클릭하세요!', en: 'Click as many times as you can in 10 seconds!', ja: '10秒間にできるだけ多くクリックしよう！' },
    emoji: '👆',
    category: 'speed'
  },
  {
    id: 'aim-trainer',
    title: { ko: '목표물 클릭', en: 'Aim Trainer', ja: 'エイムトレーナー' },
    description: { ko: '나타나는 원을 빠르게 클릭하세요!', en: 'Click the appearing circles quickly!', ja: '現れる円を素早くクリックしよう！' },
    emoji: '🎯',
    category: 'reaction'
  },
  {
    id: 'sequence-memory',
    title: { ko: '순서 기억', en: 'Sequence Memory', ja: '順序記憶' },
    description: { ko: '숫자를 순서대로 클릭하세요!', en: 'Click numbers in order!', ja: '数字を順番にクリックしよう！' },
    emoji: '🔢',
    category: 'memory'
  },
  {
    id: 'word-puzzle',
    title: { ko: '단어 만들기', en: 'Word Puzzle', ja: '単語パズル' },
    description: { ko: '주어진 글자로 단어를 만드세요!', en: 'Create words from given letters!', ja: '与えられた文字で単語を作ろう！' },
    emoji: '📝',
    category: 'brain'
  }
];

module.exports = games;
