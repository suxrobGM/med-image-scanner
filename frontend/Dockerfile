FROM node:22.6.0-alpine
EXPOSE 8001

ENV NEXT_PUBLIC_BACKEND_URL="https://server.medscanner.health"
ENV NEXT_PUBLIC_VIEWER_URL="https://viewer.medscanner.health"

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN mv .env.default .env

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "start"]
