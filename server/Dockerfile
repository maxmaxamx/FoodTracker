FROM node:20-alpine

WORKDIR /app

# Копируем манифесты зависимостей
COPY package*.json ./

# Устанавливаем зависимости (работает и с локфайлом, и без)
RUN npm install

# Копируем исходный код
COPY . .

# Создаём директорию для загружаемых медиафайлов
RUN mkdir -p /app/media

# Порт
EXPOSE 3000

# Запуск
CMD ["node", "server.js"]