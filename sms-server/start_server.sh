#!/bin/bash

# KT CCTV SMS 서버 시작 스크립트
# WSL 환경에서 고정 IP로 실행

# 색상 코드
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 스크립트 디렉토리로 이동
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  KT CCTV SMS 서버 시작${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 현재 WSL IP 확인
WSL_IP=$(hostname -I | awk '{print $1}')
echo -e "${YELLOW}📍 WSL IP:${NC} $WSL_IP"

# 환경변수 파일 확인
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. .env.example을 복사합니다...${NC}"
    cp .env.example .env
fi

# Python 버전 확인
PYTHON_VERSION=$(python3 --version)
echo -e "${YELLOW}🐍 Python:${NC} $PYTHON_VERSION"

# 포트 확인
PORT=8000
echo -e "${YELLOW}🔌 포트:${NC} $PORT"

# 기존 프로세스 종료
echo -e "${YELLOW}🔍 기존 서버 프로세스 확인 중...${NC}"
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  포트 $PORT가 사용 중입니다. 기존 프로세스를 종료합니다...${NC}"
    kill -9 $(lsof -ti:$PORT) 2>/dev/null
    sleep 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 서버 시작 준비 완료${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}🚀 서버 실행 중...${NC}"
echo -e "${YELLOW}   로컬 접속:${NC} http://localhost:$PORT"
echo -e "${YELLOW}   WSL 접속:${NC} http://$WSL_IP:$PORT"
echo -e "${YELLOW}   헬스 체크:${NC} http://localhost:$PORT/health"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💡 서버 종료: Ctrl+C${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 서버 실행 (0.0.0.0으로 바인딩하여 모든 인터페이스에서 접근 가능)
python3 main.py
