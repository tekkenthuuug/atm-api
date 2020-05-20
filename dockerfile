FROM node:12.16.1

WORKDIR /usr/src/atm-backend

COPY ./ ./

RUN yarn install

CMD node index.js --bind 0.0.0.0
