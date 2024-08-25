# Use a Node.js base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 5173

# Command to run the application
CMD ["npm", "start"]