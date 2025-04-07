#!/bin/bash

# Stop Nginx to free up port 80
cd /opt/itwasjacob/docker
docker compose stop nginx

# Run certbot renewal
docker run --rm -p 80:80 \
    -v /opt/itwasjacob/docker/config/letsencrypt:/etc/letsencrypt \
    certbot/certbot renew

# Start Nginx back up
docker compose start nginx

# Log the renewal attempt
echo "SSL renewal attempt completed at $(date)" >> /var/log/ssl-renewal.log 