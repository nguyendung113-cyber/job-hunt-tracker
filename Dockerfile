# Sử dụng Nginx nhẹ để phục vụ sản phẩm đã build
FROM nginx:stable-alpine

# Copy thư mục dist đã build ở máy thật vào container
COPY ./dist /usr/share/nginx/html

# Cấu hình Nginx để không lỗi khi reload trang (SPA)
RUN printf 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]