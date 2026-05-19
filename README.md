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

После push в `main`/`master` workflow `.github/workflows/deploy.yml` соберёт сайт. В настройках репозитория: **Settings → Pages → Build and deployment → GitHub Actions**.

Если репозиторий называется иначе, измените `base` в `vite.config.ts` и путь в workflow под имя репозитория.

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
