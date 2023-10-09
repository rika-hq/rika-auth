FROM node:18-alpine
WORKDIR /runtime

# Don't rebuild this layer unless new dependence added
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start:prod"]

EXPOSE 7337