FROM node:slim

# Install We.js CLI and generators
RUN npm install -g --silent we yo generator-wejs

# Mount API folder in docker
WORKDIR /usr/src/app