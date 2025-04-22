# Use official nginx image as the base
FROM nginx:alpine

# Remove the default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static site files to nginx
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx (default CMD in base image) 