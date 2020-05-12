FROM node:12.16.1

WORKDIR /usr/src/atm-backend

COPY ./ ./

RUN yarn install

CMD ["/bin/bash"]
