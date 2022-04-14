FROM node:10-alpine

RUN apk update && apk add npm && npm install -g nodemon

WORKDIR /opt/app
COPY . .

RUN npm i

CMD ["npm", "run", "start"]