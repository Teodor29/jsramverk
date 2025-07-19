FROM node:16

WORKDIR /backend

COPY package*.json ./

RUN npm install && npm install cors express

COPY . .

EXPOSE 1337

CMD ["npm", "start"]
