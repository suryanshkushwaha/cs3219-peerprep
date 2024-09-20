FROM node:22-alpine

COPY --link package.json yarn.lock ./

RUN yarn

COPY --link . .

# The port should be specified in an .env file.
EXPOSE 3333

CMD ["yarn", "run", "start"]