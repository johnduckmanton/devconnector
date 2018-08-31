# base image
FROM node:8.11.3 as builder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ARG BASEDIR="/client"

ENV NODE_ENV production

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ${BASEDIR}/package*.json /usr/src/app

RUN npm install --silent
RUN npm install react-scripts@1.1.4 -g --silent

COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine



COPY --from=builder /usr/src/app/build /usr/share/nginx/html

ENV REACT_APP_API_URL "http://localhost:3001"

# Install bash shell for debugging 
RUN apk update && apk add bash

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]