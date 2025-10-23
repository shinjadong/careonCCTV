# Windows 포트포워딩 설정 스크립트
# PowerShell을 관리자 권한으로 실행 필요

# WSL IP 자동 감지
$wslIP = (wsl hostname -I).Trim().Split(' ')[0]

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "  Windows → WSL 포트포워딩 설정" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "📍 WSL IP: $wslIP" -ForegroundColor Yellow
Write-Host "🔌 포트: 8000" -ForegroundColor Yellow
Write-Host ""

# 기존 포트포워딩 규칙 제거
Write-Host "🔍 기존 포트포워딩 규칙 확인 중..." -ForegroundColor Yellow
$existingRule = netsh interface portproxy show v4tov4 | Select-String "8000"
if ($existingRule) {
    Write-Host "⚠️  기존 규칙 발견. 제거합니다..." -ForegroundColor Yellow
    netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0
}

# 새 포트포워딩 규칙 추가
Write-Host "➕ 새 포트포워딩 규칙 추가 중..." -ForegroundColor Yellow
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=$wslIP

# 방화벽 규칙 추가
Write-Host "🛡️  방화벽 규칙 추가 중..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "WSL SMS Server" -ErrorAction SilentlyContinue
if (-not $firewallRule) {
    New-NetFirewallRule -DisplayName "WSL SMS Server" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
    Write-Host "✅ 방화벽 규칙 추가 완료" -ForegroundColor Green
} else {
    Write-Host "✅ 방화벽 규칙이 이미 존재합니다" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "✅ 포트포워딩 설정 완료!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "📋 현재 포트포워딩 규칙:" -ForegroundColor Yellow
netsh interface portproxy show v4tov4
Write-Host ""
Write-Host "💡 외부 접속 주소:" -ForegroundColor Yellow
Write-Host "   http://<Windows_IP>:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 포트포워딩 제거 방법:" -ForegroundColor Yellow
Write-Host "   netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0" -ForegroundColor Gray
