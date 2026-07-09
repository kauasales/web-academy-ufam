FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y nginx

RUN sed -i 's/listen 80 default_server;/listen 7000 default_server;/g' /etc/nginx/sites-available/default
RUN sed -i 's/listen \[::\]:80 default_server;/listen \[::\]:7000 default_server;/g' /etc/nginx/sites-available/default

EXPOSE 7000

CMD ["nginx", "-g", "daemon off;"]