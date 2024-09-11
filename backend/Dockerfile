FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
