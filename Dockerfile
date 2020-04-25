FROM node:alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN apk add python make g++ && \
    npm install

CMD [ "npm", "run", "serve" ]
