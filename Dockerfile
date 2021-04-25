FROM tiangolo/node-frontend:10 AS build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

FROM nginx AS runtime

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
