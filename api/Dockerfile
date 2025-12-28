# Use Node.js LTS as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the files from the current directory to the container
COPY . .

# Build the application
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
