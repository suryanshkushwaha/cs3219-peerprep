FROM node:22-alpine
ARG PORT
ENV PORT=$PORT

COPY --link package.json yarn.lock ./

RUN yarn

COPY --link . .

EXPOSE ${PORT}

CMD ["yarn", "run", "start"]