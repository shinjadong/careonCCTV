# Claude Code - SMS 서버 설정 및 실행 프롬프트

다음 내용을 AWS 서버의 Claude Code에 복사하여 붙여넣으세요:

---

KT CCTV SMS 알림 서버를 설정하고 실행해줘.

## 현재 상황
- 위치: `/home/ubuntu/careon-cctv/careonCCTV/sms-server`
- Python 프로젝트: FastAPI 기반 SMS 서버
- 뿌리오 API 사용 (공식 예제 코드 기반)

## 수행할 작업

### 1. Python 환경 설정
```bash
# python3-venv 설치 (필요시)
sudo apt update
sudo apt install python3.12-venv -y

# 가상환경 생성
cd /home/ubuntu/careon-cctv/careonCCTV/sms-server
python3 -m venv venv

# 가상환경 활성화
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경변수 파일 생성
`.env` 파일을 생성하고 다음 내용 입력:

```
PPURIO_USERNAME=nvr_1328562899
PPURIO_TOKEN=7a72ae1ebc0e94c50ab5d04096fa8098aed0d4c272a6ed29cd1ecca94d22c480
PPURIO_FROM_NUMBER=18661845
STAFF_NUMBERS=
```

**중요**: `STAFF_NUMBERS`는 비워두고, 사용자가 직접 입력할 수 있게 안내해줘.

### 3. 테스트 실행
```bash
# 서버 실행 (포그라운드)
python main.py
```

서버가 실행되면 다음과 같은 로그가 나와야 함:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4. 헬스 체크 (새 터미널)
```bash
curl http://localhost:8000/health
```

예상 결과:
```json
{
  "status": "healthy",
  "ppurio_configured": true,
  "staff_count": 0
}
```

### 5. systemd 서비스 등록
서비스 파일 생성: `/etc/systemd/system/cctv-sms.service`

내용:
```ini
[Unit]
Description=KT CCTV SMS Notification Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/careon-cctv/careonCCTV/sms-server
Environment="PATH=/home/ubuntu/careon-cctv/careonCCTV/sms-server/venv/bin"
ExecStart=/home/ubuntu/careon-cctv/careonCCTV/sms-server/venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

서비스 등록 및 시작:
```bash
sudo systemctl daemon-reload
sudo systemctl enable cctv-sms.service
sudo systemctl start cctv-sms.service
sudo systemctl status cctv-sms.service
```

## 성공 기준
- [ ] python3-venv 설치 완료
- [ ] 가상환경 생성 및 활성화 완료
- [ ] requirements.txt 의존성 설치 완료
- [ ] .env 파일 생성 (STAFF_NUMBERS 제외)
- [ ] 서버 실행 성공 (port 8000)
- [ ] curl 헬스 체크 성공
- [ ] systemd 서비스 등록 완료
- [ ] 서비스 상태 active (running)

## 주의사항
- 모든 명령어 실행 결과를 보고해줘
- 오류 발생 시 로그를 보여줘
- .env 파일의 STAFF_NUMBERS는 사용자가 입력하게 안내

## 최종 보고
작업 완료 후 다음 정보를 보고:
1. 서비스 상태 (systemctl status 결과)
2. 헬스 체크 결과 (curl 응답)
3. 서버 로그 최근 10줄 (journalctl -n 10)
4. STAFF_NUMBERS 설정 방법 안내

시작해줘!
