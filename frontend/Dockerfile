FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

# Serve the built Vue app
CMD ["serve", "-s", "dist", "-l", "5173"]
