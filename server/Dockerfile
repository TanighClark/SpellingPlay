# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Skip Chromium download for Puppeteer if you already bundle it or don’t need it in deploy
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code (after installing deps for cache efficiency)
COPY . .

# Expose app port
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
