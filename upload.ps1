# ChiHai 企业官网 - 一键上传脚本
# 用于上传文件到 Ubuntu 服务器

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  ChiHai 企业官网 - 一键上传" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 检查文件是否存在
$requiredFiles = @(
    "nginx.conf",
    "deploy.sh",
    "dist\index.html"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ 文件不存在: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "请确保您在正确的目录中运行此脚本" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 所有必需文件检查通过" -ForegroundColor Green
Write-Host ""

# 上传配置文件
Write-Host "[1/3] 上传 Nginx 配置..." -ForegroundColor Yellow
scp nginx.conf root@${ServerIP}:/tmp/
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ nginx.conf 已上传" -ForegroundColor Green
} else {
    Write-Host "   ❌ 上传失败" -ForegroundColor Red
    exit 1
}

# 上传部署脚本
Write-Host "[2/3] 上传部署脚本..." -ForegroundColor Yellow
scp deploy.sh root@${ServerIP}:/tmp/
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ deploy.sh 已上传" -ForegroundColor Green
} else {
    Write-Host "   ❌ 上传失败" -ForegroundColor Red
    exit 1
}

# 上传网站文件
Write-Host "[3/3] 上传网站文件..." -ForegroundColor Yellow
scp -r dist\* root@${ServerIP}:/tmp/website-files/
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ 网站文件已上传" -ForegroundColor Green
} else {
    Write-Host "   ❌ 上传失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  ✅ 所有文件上传完成！" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步：连接服务器并运行部署命令" -ForegroundColor Yellow
Write-Host ""
Write-Host "ssh root@${ServerIP}" -ForegroundColor White
Write-Host ""
Write-Host "然后运行：" -ForegroundColor Yellow
Write-Host "chmod +x /tmp/deploy.sh" -ForegroundColor White
Write-Host "sudo bash /tmp/deploy.sh" -ForegroundColor White
Write-Host "sudo mkdir -p /var/www/chihai" -ForegroundColor White
Write-Host "sudo cp -r /tmp/website-files/* /var/www/chihai/" -ForegroundColor White
Write-Host "sudo chown -R www-data:www-data /var/www/chihai" -ForegroundColor White
Write-Host ""
Write-Host "完成后访问: http://${ServerIP}" -ForegroundColor Green
Write-Host ""
