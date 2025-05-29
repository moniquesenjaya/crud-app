# Use Node image to build the app
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use a lightweight web server to serve the build
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Expose default port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
