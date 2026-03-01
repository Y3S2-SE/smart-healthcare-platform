FROM node:18.19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3005
CMD ["node", "index.js"]