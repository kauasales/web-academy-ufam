FROM node:alpine

WORKDIR /app

COPY backend.js .

RUN npm init -y

EXPOSE 4000

# Comando para rodar a aplicação
CMD ["node", "backend.js"]