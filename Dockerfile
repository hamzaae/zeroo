# Use the official Node.js 18 image as the base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install necessary dependencies
RUN npm install

# Copy all files to the container
COPY . .

# Expose the port the API will run on
EXPOSE 3000

# Build the app for production
RUN npm run build

# Start the Next.js app
CMD ["npm", "run", "start"]
