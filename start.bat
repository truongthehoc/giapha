@echo off
chcp 65001 > nul
title Website Gia Phả Đại Tộc - Đang Khởi Động

echo ==========================================================
echo       🌳 HỆ THỐNG QUẢN LÝ & TRA CỨU GIA PHẢ ĐẠI TỘC 🌳
echo ==========================================================
echo.

:: Kiểm tra node_modules
if not exist "node_modules\" (
    echo [INFO] Đang cài đặt thư viện dependencies lần đầu...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Cài đặt thất bại. Vui lòng kiểm tra Node.js và kết nối mạng.
        pause
        exit /b %errorlevel%
    )
)

echo [INFO] Đang khởi động máy chủ Web tại http://localhost:3000 ...
echo [INFO] Vui lòng giữ cửa sổ này trong khi sử dụng website.
echo.

:: Tự động mở trình duyệt sau 3 giây
start "" http://localhost:3000

:: Khởi chạy Next.js dev server
call npm run dev

pause
