FROM node:22-alpine

# OHIF viewer server
EXPOSE 8002

# Proxy server
EXPOSE 8003

ENV HOST=${HOST}

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "run", "start"]
