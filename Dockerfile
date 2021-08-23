FROM node AS build

WORKDIR /usr/src/app

# Install Dependencies

COPY package*.json ./

COPY patches patches

RUN npm install

# Build

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx/gzip.conf /etc/nginx/conf.d/gzip.conf

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
