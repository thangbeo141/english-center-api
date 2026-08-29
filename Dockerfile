# 1. Khai báo môi trường nền: Dùng Node.js bản nhẹ (alpine)
FROM node:24-alpine

# 2. Thiết lập thư mục làm việc bên trong chiếc "hộp" Docker
WORKDIR /app

# 3. Copy 2 file package.json vào trước để cài đặt thư viện
COPY package*.json ./

# 4. Chạy lệnh cài đặt các gói (giống hệt bạn gõ npm install trên máy)
RUN npm install

# 5. Copy toàn bộ mã nguồn còn lại (thư mục src) vào trong hộp
COPY . .

# 6. Thông báo cho hệ thống biết ứng dụng này chạy ở cổng 3000
EXPOSE 3000

# 7. Lệnh cuối cùng để khởi động server khi Docker chạy
CMD ["node", "src/server.js"]