FROM node:22-alpine

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

CMD ["yarn", "start"]