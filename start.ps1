# Script khởi chạy hệ thống Gia Phả trên PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==========================================================" -ForegroundColor DarkYellow
Write-Host "      🌳 HỆ THỐNG QUẢN LÝ & TRA CỨU GIA PHẢ ĐẠI TỘC 🌳" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor DarkYellow
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Đang cài đặt thư viện phụ thuộc..." -ForegroundColor Cyan
    npm.cmd install
}

Write-Host "[INFO] Khởi động ứng dụng tại http://localhost:3000 ..." -ForegroundColor Green
Start-Process "http://localhost:3000"

npm.cmd run dev
