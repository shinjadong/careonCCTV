# SMS 서버 고정 IP 설정 가이드

## 현재 네트워크 정보

**WSL IP**: `172.22.115.206`
**Windows Host IP**: `10.255.255.254`
**포트**: `8000`

---

## 🚀 빠른 시작 (WSL 내부 접속)

```bash
# sms-server 디렉토리에서 실행
./start_server.sh
```

**접속 주소**:
- WSL 내부: `http://localhost:8000`
- WSL IP: `http://172.22.115.206:8000`

---

## 🌐 외부 접속 설정 (Windows 포트포워딩)

### 1단계: PowerShell 관리자 권한 실행

Windows에서 PowerShell을 **관리자 권한**으로 실행합니다.

### 2단계: 포트포워딩 설정

```powershell
# WSL 디렉토리로 이동
cd \\wsl$\Ubuntu\home\tlswk\projects\careon\careonCCTV\sms-server

# 포트포워딩 스크립트 실행
.\setup_port_forwarding.ps1
```

또는 수동 설정:

```powershell
# WSL IP 확인
wsl hostname -I

# 포트포워딩 추가
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=172.22.115.206

# 방화벽 규칙 추가
New-NetFirewallRule -DisplayName "WSL SMS Server" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
```

### 3단계: 포트포워딩 확인

```powershell
netsh interface portproxy show v4tov4
```

---

## 📍 접속 주소 정리

| 접속 위치 | URL | 용도 |
|---------|-----|------|
| WSL 내부 | `http://localhost:8000` | 로컬 개발/테스트 |
| WSL IP | `http://172.22.115.206:8000` | WSL 내부 네트워크 |
| Windows 로컬 | `http://localhost:8000` | 포트포워딩 후 |
| 같은 네트워크 | `http://<Windows_IP>:8000` | 포트포워딩 + 방화벽 개방 후 |

---

## 🧪 서버 테스트

### 헬스 체크

```bash
curl http://localhost:8000/health
```

**예상 응답**:
```json
{
  "status": "healthy",
  "ppurio_configured": true,
  "staff_count": 0
}
```

### 테스트 SMS 발송 (선택사항)

```bash
curl -X POST "http://localhost:8000/test-sms?phone=010-1234-5678&message=테스트"
```

---

## 🔧 환경변수 설정

`.env` 파일을 수정하여 직원 전화번호를 추가하세요:

```bash
nano .env
```

```env
# 직원 전화번호 (쉼표로 구분)
STAFF_NUMBERS=010-1234-5678,010-9876-5432
```

---

## 🛠️ 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# 포트 사용 프로세스 확인
lsof -i :8000

# 프로세스 종료
kill -9 $(lsof -ti:8000)
```

### WSL IP가 변경된 경우

WSL2는 재부팅 시 IP가 변경될 수 있습니다.

**해결 방법**:
1. `start_server.sh`를 실행하면 자동으로 현재 IP를 표시합니다
2. Windows 포트포워딩을 다시 설정합니다:
   ```powershell
   # 기존 규칙 제거
   netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0

   # 새 IP로 규칙 추가
   netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=<NEW_WSL_IP>
   ```

### 포트포워딩 제거

```powershell
# Windows PowerShell (관리자)
netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0

# 방화벽 규칙 제거
Remove-NetFirewallRule -DisplayName "WSL SMS Server"
```

---

## 📊 서버 로그 확인

서버 실행 시 실시간 로그가 출력됩니다:

```
2025-10-23 02:00:00 - uvicorn.error - INFO - Started server process
2025-10-23 02:00:00 - uvicorn.error - INFO - Waiting for application startup.
2025-10-23 02:00:00 - uvicorn.error - INFO - Application startup complete.
```

---

## 🔄 자동 실행 설정 (선택사항)

### WSL 자동 시작 스크립트

`~/.bashrc` 또는 `~/.zshrc`에 추가:

```bash
# SMS 서버 자동 시작 (백그라운드)
# alias start-sms="cd /home/tlswk/projects/careon/careonCCTV/sms-server && nohup ./start_server.sh > server.log 2>&1 &"
```

### Windows 시작 시 자동 실행

작업 스케줄러를 사용하여 Windows 시작 시 자동으로 포트포워딩 설정:

1. `작업 스케줄러` 열기
2. `기본 작업 만들기`
3. 트리거: `컴퓨터 시작 시`
4. 작업: `프로그램 시작`
5. 프로그램: `powershell.exe`
6. 인수: `-ExecutionPolicy Bypass -File "\\wsl$\Ubuntu\home\tlswk\projects\careon\careonCCTV\sms-server\setup_port_forwarding.ps1"`

---

## 📝 API 문서

서버 실행 후 Swagger 문서 확인:

```
http://localhost:8000/docs
```

---

## ✅ 체크리스트

- [ ] `.env` 파일 생성 및 환경변수 설정
- [ ] Python 패키지 설치 완료
- [ ] `start_server.sh` 실행 권한 부여
- [ ] 서버 실행 및 헬스 체크 성공
- [ ] (선택) Windows 포트포워딩 설정
- [ ] (선택) 방화벽 규칙 추가
- [ ] (선택) 직원 전화번호 설정
- [ ] (선택) 테스트 SMS 발송 확인
