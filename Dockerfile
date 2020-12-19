FROM node:alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'yarn.lock
COPY ["package.json", "yarn.lock", "./"]

# install project dependencies
RUN yarn --silent

CMD [ "yarn", "run", "serve" ]
