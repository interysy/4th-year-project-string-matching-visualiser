
FROM node:18.18.0-alpine As build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.25.2-alpine 

COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/dist/* /usr/share/nginx/html/