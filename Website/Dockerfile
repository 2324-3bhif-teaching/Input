# Use node image with TypeScript and ts-node installed
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 3001
EXPOSE 8080

# Command to run both servers
CMD ["npm", "start"]
