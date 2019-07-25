# Multi-stage docker build file
#
# Build the artifacts and use them in
# production stage by copings
FROM node:10-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /var/www/public
CMD ["nginx", "-g", "daemon off;"]