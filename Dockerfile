FROM node:15.12.0

RUN mkdir -p /usr/src/app   

WORKDIR /usr/src/app

COPY package.json /usr/src/app

COPY .env /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 4000

CMD ["npm","run","start"]
