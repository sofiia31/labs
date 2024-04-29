FROM node:latest

# Переміщаємо робочий каталог в контейнер
WORKDIR /app

# Копіюємо package.json та package-lock.json в контейнер
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів у контейнер
COPY . .

# Вказуємо порт, на якому працює додаток
EXPOSE 3000

# Команда для запуску додатку
CMD ["node", "app.js"]