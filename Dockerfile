FROM node:23-alpine3.20

# Set the working directory inside the container
#WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install
# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pm2-runtime", "pdf"]