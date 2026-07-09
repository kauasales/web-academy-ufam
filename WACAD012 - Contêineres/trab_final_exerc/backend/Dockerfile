FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY server.ts ./
RUN npm run build
EXPOSE 4444
CMD ["npm", "start"]