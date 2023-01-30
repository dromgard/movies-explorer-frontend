# Frontend для дипломного проекта "Поиск фильмов"

:exclamation:С 30.01.2023 разработка проекта ведется в общем с бэкендом репозитории - https://github.com/dromgard/movies-explorer-api-full

### Описание проекта:

Frontend часть проекта включает в себя верстку и функционал на ReactJS. Реализован переход между страницами, защищенные роуты, API до BeatFilm и собственного Backend, адаптивная верстка.

### Используемые технологии:

<img src="https://img.shields.io/badge/ReactJS-blue?logo=React&logoColor=white" alt="ReactJS"/> <img src="https://img.shields.io/badge/CSS3-blue?logo=css3&logoColor=white" alt="CSS3"/> <img src="https://img.shields.io/badge/HTML5-blue?logo=html5&logoColor=white" alt="HTML5"/>

- Обращение к API реализовано через fetch запросы.
- Для хранения токена и поисковых запросов используется localStorage.
- Переход между страницами и защищенные роуты релизованы через react-router-dom v.6.
- В проекте применена адаптивная верстка, сайт отлично выглядит на экранах с большим и маленьким разрешением. Именование классов по БЭМ.
- Для адаптивной верстки в CSS используются медиазапросы.
- Для верстки блоков сайта использованы flex и grid.

### Макет:

[Макет сайта - https://disk.yandex.ru/d/l-wlrA_LI5JmaQ](https://disk.yandex.ru/d/l-wlrA_LI5JmaQ)

### Публикация в интернете:

[Frontend - https://serhio-diploma.nomoredomains.rocks/](https://serhio-diploma.nomoredomains.rocks/)

### Запуск проекта:

Требования:

- Node.js >= 14;
- npm >= 6.14;

Frontend:

- `npm start` — запускает проект в режиме разработчика.
- `npm run build` — собирает проект для продакшена в папочку `build`.
