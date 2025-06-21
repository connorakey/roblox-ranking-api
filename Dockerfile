FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm install -g dotenv-cli
CMD ["dotenv", "--", "node", "index.js"]
