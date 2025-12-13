# Project Guidelines

## Localization (i18n) - CRITICAL

This project supports multiple languages (Korean, English, Japanese). **All text visible to users MUST be localized.**

### Localization Checklist

When adding or modifying any feature, always check:

1. **Page Titles (`<h1>`)**: Use `data-game-title` attribute and ensure title data exists in `src/common/games.js` for all languages (ko, en, ja)

2. **Static Text in HTML**: Use `data-i18n-game` attribute
   - Example: `<p data-i18n-game="reaction.desc">한국어 기본값</p>`
   - Add corresponding keys to `src/i18n/index.js` for all 3 languages

3. **Placeholders**: Use `data-i18n-game-placeholder` attribute
   - Example: `<input data-i18n-game-placeholder="typing.placeholder" placeholder="기본값">`

4. **Dynamic Text in JavaScript**: Always get text from `window.i18n[window.currentLang]`
   - Example: `window.i18n[window.currentLang].games.reaction.clickNow`

5. **Game Content Data**: Store language-specific data in `src/i18n/index.js`
   - Typing texts: `games.typing.texts` array
   - Word puzzle data: `games.wordPuzzle.wordData` array
   - Color names: `games.colorMatch.colors` object

### File Structure

- `src/i18n/index.js` - All translation strings (ko, en, ja)
- `src/common/games.js` - Game titles and descriptions (ko, en, ja)
- `src/common/layout.js` - Common UI text localization
- `src/templates/*.js` - Game-specific templates

### Adding New Text

1. Add Korean text first as the default
2. Add English translation
3. Add Japanese translation
4. Use the appropriate `data-i18n-*` attribute in HTML
5. For JavaScript, use `window.i18n[window.currentLang].path.to.key`

### Testing Localization

After making changes:
1. Run `node generate.js` to rebuild
2. Check the generated HTML in `dist/` folder
3. Verify text changes when switching languages (ko/en/ja buttons)

### Common Mistakes to Avoid

- DO NOT hardcode any user-visible text in Korean only
- DO NOT forget to add translations for all 3 languages
- DO NOT use template literals with `${title.ko}` without language switching support
- ALWAYS check if new game features have localized messages
