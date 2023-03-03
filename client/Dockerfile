FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4173
CMD ["/bin/sh", "entrypoint.sh"]