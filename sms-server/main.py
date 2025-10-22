"""
KT CCTV 견적 신청 알림 SMS 서버
FastAPI 기반 REST API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import os
from dotenv import load_dotenv

from ppurio import PpurioClient

# 환경변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI 앱 생성
app = FastAPI(title="KT CCTV SMS Notification Service", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 뿌리오 클라이언트 초기화
PPURIO_USERNAME = os.getenv("PPURIO_USERNAME", "nvr_1328562899")
PPURIO_TOKEN = os.getenv("PPURIO_TOKEN", "7a72ae1ebc0e94c50ab5d04096fa8098aed0d4c272a6ed29cd1ecca94d22c480")
PPURIO_FROM_NUMBER = os.getenv("PPURIO_FROM_NUMBER", "18661845")
STAFF_NUMBERS = os.getenv("STAFF_NUMBERS", "").split(",")

ppurio = PpurioClient(PPURIO_USERNAME, PPURIO_TOKEN)

# 요청 모델
class ConsultationNotification(BaseModel):
    name: str
    phone: str
    address: str
    camera_count: str
    place: Optional[str] = None
    referrer: Optional[str] = "직접 접속"
    utm_source: Optional[str] = None
    utm_campaign: Optional[str] = None

@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "status": "ok",
        "service": "KT CCTV SMS Notification",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    return {
        "status": "healthy",
        "ppurio_configured": bool(PPURIO_USERNAME and PPURIO_TOKEN),
        "staff_count": len([n for n in STAFF_NUMBERS if n.strip()])
    }

@app.post("/send-consultation-sms")
async def send_consultation_sms(data: ConsultationNotification):
    """
    견적 신청 알림 SMS 발송

    직원들에게 고객 견적 신청 정보를 SMS로 전송합니다.
    """
    try:
        # 직원 번호 확인
        valid_staff = [n.strip() for n in STAFF_NUMBERS if n.strip()]

        if not valid_staff:
            logger.warning("⚠️ 직원 전화번호가 설정되지 않았습니다")
            raise HTTPException(
                status_code=500,
                detail="직원 전화번호가 설정되지 않았습니다 (STAFF_NUMBERS)"
            )

        # SMS 내용 구성 (사용자 제공 템플릿)
        content = f"""[CCTV 견적 문의]
고객명: {data.name}
설치 대수: {data.camera_count}
지역: {data.address}
전화번호: {data.phone}

유입 링크: {data.referrer}"""

        logger.info(f"📤 SMS 발송 시작: {len(valid_staff)}명에게")
        logger.info(f"고객: {data.name}, 전화: {data.phone}")

        # 뿌리오 SMS 발송 (공식 예제 코드 사용)
        success = ppurio.send_sms(
            to_numbers=valid_staff,
            content=content,
            from_number=PPURIO_FROM_NUMBER,
            ref_key=f"consultation_{data.phone}"
        )

        if success:
            return {
                "success": True,
                "message": f"{len(valid_staff)}명의 직원에게 SMS 발송 완료",
                "staff_count": len(valid_staff)
            }
        else:
            raise HTTPException(status_code=500, detail="SMS 발송 실패")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ SMS 발송 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/test-sms")
async def test_sms(phone: str, message: str = "테스트 메시지입니다"):
    """테스트용 SMS 발송 엔드포인트"""
    try:
        success = ppurio.send_sms(
            to_numbers=[phone],
            content=message,
            from_number=PPURIO_FROM_NUMBER,
            ref_key="test"
        )

        if success:
            return {"success": True, "message": "테스트 SMS 발송 완료"}
        else:
            raise HTTPException(status_code=500, detail="SMS 발송 실패")

    except Exception as e:
        logger.error(f"❌ 테스트 SMS 발송 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
