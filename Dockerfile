FROM node:19-alpine as builder
# set working directory
WORKDIR /app
# copy everything inside `/app`
COPY . .
# change `app` owner to `node`
RUN chown -R node:node /app
# use this user
USER node
# install dependencies
RUN npm install
# Run our app
CMD ["npm", "run", "dev"]
