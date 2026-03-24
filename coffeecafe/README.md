# React + TypeScript + Vite

Этот шаблон предоставляет минимальную настройку для запуска React в связке с Vite, поддержкой HMR и некоторыми правилами ESLint.

В настоящее время доступны два официальных плагина:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) использует [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) использует [SWC](https://swc.rs/)

## React Compiler

React Compiler по умолчанию не включён в этом шаблоне из-за влияния на производительность разработки и сборки. Чтобы добавить его, смотрите [документацию](https://react.dev/learn/react-compiler/installation).

## Расширение конфигурации ESLint

Если вы разрабатываете production-приложение, рекомендуется обновить конфигурацию, чтобы включить правила проверки типов:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Другие конфиги...

      // Удалите tseslint.configs.recommended и замените на это
      tseslint.configs.recommendedTypeChecked,
      // Для более строгих правил используйте это
      tseslint.configs.strictTypeChecked,
      // Для стилистических правил можно добавить
      tseslint.configs.stylisticTypeChecked,

      // Другие конфиги...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // другие опции...
    },
  },
])
```

Вы также можете установить [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) и [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) для специфичных для React правил линтинга:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Другие конфиги...
      // Включить правила линтинга для React
      reactX.configs['recommended-typescript'],
      // Включить правила линтинга для React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // другие опции...
    },
  },
])
```
