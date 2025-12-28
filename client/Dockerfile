# Use Node.js LTS as the base image for building the React app
FROM node:20-alpine as build

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code to the container
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine

# Copy the build files to Nginx's public directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
