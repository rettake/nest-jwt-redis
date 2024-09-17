# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и yarn.lock (или package-lock.json) для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN yarn

# Копируем все файлы проекта
COPY . .

# Собираем приложение (если нужно)
RUN yarn build

# Открываем порт для приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["yarn", "start:prod"]