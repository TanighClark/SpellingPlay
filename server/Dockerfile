# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose the port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
