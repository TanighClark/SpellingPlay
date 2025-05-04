FROM node:18

WORKDIR /app

# Prevent puppeteer from downloading Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all app files
COPY . .

EXPOSE 8080

CMD ["npm", "start"]
