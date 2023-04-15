FROM node:latest

RUN apt update 

RUN mkdir -p /usr/src/
WORKDIR /usr/src/  

COPY package*.json /usr/src/
RUN npm install

COPY . /usr/src/

CMD ["npm", "run", "dev"]
