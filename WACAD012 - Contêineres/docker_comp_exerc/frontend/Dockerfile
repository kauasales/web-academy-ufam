FROM node:alpine
WORKDIR /app
COPY frontend.js .
RUN npm init -y && npm install querystring
EXPOSE 3000
CMD ["node", "frontend.js"]