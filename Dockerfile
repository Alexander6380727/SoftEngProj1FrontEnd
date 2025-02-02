# Step 1: Use a Node.js image for building the application
FROM node:18 AS build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy the package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the Vue application
RUN npm run build

# Step 2: Use an Nginx image to serve the built files
FROM nginx:alpine AS production-stage

# Copy the built files to Nginx's HTML directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to access the deployed app
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]