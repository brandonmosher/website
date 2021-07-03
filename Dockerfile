FROM node AS build

WORKDIR /usr/src/app

# Install Dependencies

COPY package*.json ./

RUN npm install

# Build

COPY . .

RUN npm run build

FROM nginx

# COPY nginx.conf /etc/nginx/nginx.conf
RUN sudo snap install core && \
    sudo snap refresh core && \
    sudo snap install --classic certbot && \
    sudo ln -s /snap/bin/certbot /usr/bin/certbot && \
    sudo certbot --nginx

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80 443