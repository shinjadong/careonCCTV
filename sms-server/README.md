# KT CCTV SMS 알림 서버

## 개요
견적 신청 시 직원들에게 SMS 알림을 보내는 Python FastAPI 서버입니다.
뿌리오 공식 예제 코드를 기반으로 안정성을 최대화했습니다.

---

## 🏗️ 아키텍처

```
Next.js (Frontend)
    ↓ HTTP POST
AWS EC2 Python Server (FastAPI)
    ↓ 뿌리오 API
SMS 발송 → 직원들
```

**장점:**
- 뿌리오 공식 Python 예제 거의 그대로 사용 → 오류 최소화
- 서버 분리 → 보안 (인증키 노출 방지)
- AWS에서 24/7 실행
- Next.js와 독립적 → 확장 용이

---

## 📦 설치 및 실행

### 로컬 테스트

```bash
# 1. 디렉토리 이동
cd sms-server

# 2. 가상환경 생성 (선택)
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 환경변수 설정
cp .env.example .env
# .env 파일 편집하여 STAFF_NUMBERS 설정

# 5. 서버 실행
python main.py
```

서버 실행 확인:
```bash
curl http://localhost:8000/health
```

---

## 🚀 AWS EC2 배포

### 1단계: SSH 접속
```bash
ssh -i your-key.pem ubuntu@13.209.135.199
```

### 2단계: 프로젝트 클론
```bash
cd /home/ubuntu
git clone https://github.com/shinjadong/careonCCTV.git
cd careonCCTV/sms-server
```

### 3단계: Python 환경 설정
```bash
# Python 3.10+ 설치 확인
python3 --version

# pip 업그레이드
python3 -m pip install --upgrade pip

# 가상환경 생성
python3 -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### 4단계: 환경변수 설정
```bash
# .env 파일 생성
nano .env
```

다음 내용 입력:
```
PPURIO_USERNAME=nvr_1328562899
PPURIO_TOKEN=7a72ae1ebc0e94c50ab5d04096fa8098aed0d4c272a6ed29cd1ecca94d22c480
PPURIO_FROM_NUMBER=18661845
STAFF_NUMBERS=010-1234-5678,010-9876-5432
```

**주의**: STAFF_NUMBERS에 실제 직원 전화번호를 입력하세요!

### 5단계: 서비스 등록 (systemd)

서비스 파일 생성:
```bash
sudo nano /etc/systemd/system/cctv-sms.service
```

내용:
```ini
[Unit]
Description=KT CCTV SMS Notification Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/careonCCTV/sms-server
Environment="PATH=/home/ubuntu/careonCCTV/sms-server/venv/bin"
ExecStart=/home/ubuntu/careonCCTV/sms-server/venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 6단계: 서비스 시작
```bash
# 서비스 등록
sudo systemctl daemon-reload
sudo systemctl enable cctv-sms.service

# 서비스 시작
sudo systemctl start cctv-sms.service

# 상태 확인
sudo systemctl status cctv-sms.service
```

### 7단계: 방화벽 설정
```bash
# AWS Security Group에서 8000번 포트 열기
# 또는 nginx 리버스 프록시 사용 권장
```

---

## 🧪 테스트

### 로컬 테스트
```bash
# 헬스 체크
curl http://localhost:8000/health

# 테스트 SMS 발송
curl -X POST http://localhost:8000/test-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "010-1234-5678", "message": "테스트 메시지"}'
```

### AWS 서버 테스트
```bash
# 헬스 체크
curl http://13.209.135.199:8000/health

# 견적 신청 SMS 발송
curl -X POST http://13.209.135.199:8000/send-consultation-sms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "phone": "010-1234-5678",
    "address": "서울시 강남구",
    "camera_count": "3대",
    "referrer": "https://google.com"
  }'
```

---

## 🔧 Next.js 환경변수

`.env.local`에 추가:
```bash
# SMS 서버 URL
SMS_SERVER_URL=http://13.209.135.199:8000
```

프로덕션 배포 시:
```bash
# Vercel/Netlify 환경변수에 추가
SMS_SERVER_URL=http://13.209.135.199:8000
```

---

## 📊 API 엔드포인트

### GET /
헬스 체크 (간단)

**응답:**
```json
{
  "status": "ok",
  "service": "KT CCTV SMS Notification",
  "version": "1.0.0"
}
```

### GET /health
상세 헬스 체크

**응답:**
```json
{
  "status": "healthy",
  "ppurio_configured": true,
  "staff_count": 2
}
```

### POST /send-consultation-sms
견적 신청 알림 SMS 발송

**요청:**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "address": "서울시 강남구",
  "camera_count": "3대",
  "place": "가정집",
  "referrer": "https://google.com",
  "utm_source": "google",
  "utm_campaign": "cctv_ad"
}
```

**응답:**
```json
{
  "success": true,
  "message": "2명의 직원에게 SMS 발송 완료",
  "staff_count": 2
}
```

### POST /test-sms
테스트 SMS 발송

**요청:**
```json
{
  "phone": "010-1234-5678",
  "message": "테스트 메시지입니다"
}
```

---

## 🔍 로그 확인

### systemd 서비스 로그
```bash
# 실시간 로그
sudo journalctl -u cctv-sms.service -f

# 최근 100줄
sudo journalctl -u cctv-sms.service -n 100

# 오늘 로그만
sudo journalctl -u cctv-sms.service --since today
```

### 애플리케이션 로그
```
📤 SMS 발송 요청: SMS, 2명
✅ SMS 발송 성공: {'code': 1000, 'description': 'ok', ...}
```

---

## 🐛 문제 해결

### SMS가 발송되지 않을 때

**1. 환경변수 확인**
```bash
cat .env
# STAFF_NUMBERS가 비어있지 않은지 확인
```

**2. 뿌리오 계정 확인**
- 로그인: https://www.ppurio.com
- 잔액 확인: 8,392원 (약 17건 발송 가능)
- 발신번호 인증 확인: 1866-1845

**3. 서버 로그 확인**
```bash
sudo journalctl -u cctv-sms.service -n 50
```

**4. 방화벽 확인**
```bash
# AWS Security Group에서 8000번 포트 허용 확인
```

### 토큰 오류 (3001, 3002)
```
Error: invalid basic Authentication
```

**해결:**
- PPURIO_USERNAME, PPURIO_TOKEN 확인
- 뿌리오 홈페이지에서 인증키 재발급

### IP 제한 오류 (3003)
```
Error: IP가 유효하지 않음
```

**해결:**
- 뿌리오 홈페이지 → 문자연동 → 연동 관리
- AWS EC2 IP 추가: 13.209.135.199

---

## 🔐 보안 권장사항

### 1. API 키 보호
- .env 파일은 절대 git에 커밋하지 마세요
- .gitignore에 .env 추가됨

### 2. nginx 리버스 프록시 (권장)
```nginx
server {
    listen 80;
    server_name sms.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. HTTPS 설정
Let's Encrypt로 무료 SSL 인증서 발급 권장

---

## 📈 모니터링

### 서비스 상태 모니터링
```bash
# 서비스 상태
sudo systemctl status cctv-sms.service

# CPU/메모리 사용량
top -p $(pgrep -f "python main.py")
```

### 헬스 체크 스크립트
```bash
# 크론잡 설정 (5분마다)
*/5 * * * * curl -f http://localhost:8000/health || systemctl restart cctv-sms.service
```

---

## 🔄 업데이트 방법

```bash
# 1. SSH 접속
ssh ubuntu@13.209.135.199

# 2. 코드 업데이트
cd /home/ubuntu/careonCCTV
git pull origin main

# 3. 서비스 재시작
sudo systemctl restart cctv-sms.service

# 4. 상태 확인
sudo systemctl status cctv-sms.service
```

---

## 💰 비용

### 뿌리오 요금
- SMS (90자 이하): 약 15원/건
- LMS (장문): 약 50원/건

### AWS EC2
- t2.micro: 무료 티어 (12개월)
- 이후: 월 약 $10

---

## 📞 발신번호 관리

현재 인증된 번호: **1866-1845**

추가 발신번호 등록:
1. 뿌리오 홈페이지 로그인
2. 발신번호 관리 → 새 번호 등록
3. 인증 완료 후 .env의 PPURIO_FROM_NUMBER 업데이트

---

## 🎯 다음 단계

1. ✅ AWS EC2에 Python 서버 배포
2. ⚙️ STAFF_NUMBERS 환경변수 설정 (직원 번호)
3. 🧪 테스트 SMS 발송
4. 🚀 Next.js SMS_SERVER_URL 환경변수 설정
5. ✅ 실제 견적 신청으로 테스트

---

**뿌리오 공식 코드 기반 → 안정성 보장!** 🎉
