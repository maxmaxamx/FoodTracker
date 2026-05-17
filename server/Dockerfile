FROM node:20-alpine

WORKDIR /app

# Копируем манифесты зависимостей
COPY package*.json ./

# Устанавливаем зависимости (работает и с локфайлом, и без)
RUN npm install --omit=dev

# Копируем исходный код
COPY . .

# Порт
EXPOSE 3000

# Запуск
CMD ["node", "server.js"]