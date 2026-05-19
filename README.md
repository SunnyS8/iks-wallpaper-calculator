# Калькулятор обоев экосистемы ИКС (MSD)

Интерактивный веб-калькулятор для расчёта бесшовного полотна, алюминиевых профилей, уплотнителей и клея при холодной натяжке.

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`  
Тесты: `npm test`

## Публикация на GitHub

1. Установите [Git](https://git-scm.com/) и [GitHub CLI](https://cli.github.com/).
2. Войдите: `gh auth login`
3. В корне проекта выполните:

```powershell
cd C:\Users\User\Documents\iks-wallpaper-calculator
powershell -ExecutionPolicy Bypass -File .\scripts\publish-to-github.ps1
```

Скрипт создаст репозиторий `iks-wallpaper-calculator` (или `iks-msd-wallpaper-calculator`, если имя занято) и отправит код.

### GitHub Pages (демо)

1. Создайте репозиторий на GitHub и отправьте код в ветку **`main`** (или **`master`**).
2. В репозитории: **Settings → Pages → Build and deployment** — выберите **GitHub Actions** (не «Deploy from a branch»).
3. В **Settings → Actions → General → Workflow permissions** включите **Read and write permissions** и сохраните.
4. Сделайте push (или **Actions → Deploy to GitHub Pages → Run workflow**). После зелёной галочки сайт будет по адресу:

   `https://<ваш-логин>.github.io/<имя-репозитория>/`

Имя репозитория в URL подставляется автоматически (`BASE_PATH` в workflow); менять `vite.config.ts` не нужно.

### Деплой «завис» или не идёт

1. **Actions → откройте последний workflow → шаги.** Часто падает `build` (ошибка npm/TypeScript) — текст ошибки в логе шага.
2. **Ожидание среды `github-pages`:** в том же запуске может появиться кнопка **Review deployments** или запрос на подтверждение — нажмите **Approve** (первый деплой иногда требует одобрения).
3. **Settings → Actions → General:** в блоке **Workflow permissions** выберите **Read and write permissions** и сохраните (нужно для Pages).
4. **Settings → Pages:** источник — **GitHub Actions**, ветка не важна для этого варианта.
5. Зависший запуск: **Actions → workflow → Cancel workflow**, затем **Re-run all jobs** или сделайте пустой коммит и push.

В репозитории должен быть актуальный `.github/workflows/deploy.yml` (в сборке используется `npm install`, чтобы не требовать `package-lock.json`).

## Формулы

- **Длина отреза полотна:** L + 0,2 м (допуск на заправку в профиль).
- **Площадь полотна:** длина отреза × ширина рулона.
- **Рулоны:** упаковка отрезов в рулоны по 70 м (FFD).
- **Профили:** `ceil(метры / 2)` ламелей по 2 пог. м.
- **Разделитель (АП 5999):** при зонировании `(зон − 1) × высота`.
- **Уплотнитель:** `ceil(площадь / площадь упаковки)`.
- **Клей:** 0,07 л/м²; канистры 5 л и баллоны 650 мл.

Цены в `src/constants/prices.ts` — тестовые, с НДС 22%.

## Стек

React, Vite, TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod, TanStack Table, Lucide.
