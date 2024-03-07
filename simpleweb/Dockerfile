# specify a base imafge
 FROM node:14-alpine

WORKDIR /usr/app
 #instal some dependencies
 COPY ./package.json ./
 RUN npm install 
 COPY ./ ./

 #default command

 CMD ["npm","start"]