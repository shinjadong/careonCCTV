"""
뿌리오 SMS 발송 API (공식 예제 코드 기반)
거의 원본 그대로 사용하여 오류 최소화
"""

import logging
import requests
from requests.auth import HTTPBasicAuth
from typing import List, Optional
import os

API_URL = "https://message.ppurio.com"

class PpurioClient:
    def __init__(self, username: str, token: str):
        self.username = username
        self.token = token
        self.access_token = None

    def make_request(self, url, auth=None, payload=None, headers=None):
        """뿌리오 공식 예제 코드의 make_request 함수 (거의 그대로)"""
        response = None
        try:
            response = requests.post(url, headers=headers, json=payload, auth=auth, timeout=5)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            if response:
                logging.error(f"An error occurred: {response.json()}")
            else:
                logging.error(f"Request failed: {e}")
            raise

        return response.json()

    def get_access_token(self):
        """엑세스 토큰 발급 (한 번 발급된 토큰은 24시간동안 유효합니다.)"""
        # 뿌리오 공식 예제 코드 그대로
        url = f"{API_URL}/v1/token"
        auth = HTTPBasicAuth(self.username, self.token)

        # response 데이터 생성
        response_data = self.make_request(url, auth)

        # access_token 반환
        token = response_data.get("token") if response_data else None

        if token:
            self.access_token = token
            logging.info("✅ 뿌리오 토큰 발급 성공")

        return token

    def send_sms(
        self,
        to_numbers: List[str],
        content: str,
        from_number: str,
        ref_key: str = "sms_notification"
    ) -> bool:
        """
        SMS 발송 (뿌리오 공식 예제 기반)

        Args:
            to_numbers: 수신자 번호 리스트
            content: 메시지 내용
            from_number: 발신 번호
            ref_key: 참조 키
        """
        # 토큰이 없으면 발급
        if not self.access_token:
            self.get_access_token()

        # 메시지 타입 자동 결정 (SMS: 90자 이하, LMS: 91자 이상)
        message_type = "SMS" if len(content.encode('utf-8')) <= 90 else "LMS"

        # request 데이터 세팅 (뿌리오 공식 예제 구조 그대로)
        url = f"{API_URL}/v1/message"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }

        # targets 리스트 구성
        targets = [
            {
                "to": number.replace("-", ""),  # 하이픈 제거
                "name": ""
            }
            for number in to_numbers
        ]

        payload = {
            "account": self.username,
            "messageType": message_type,
            "content": content,
            "from": from_number.replace("-", ""),
            "duplicateFlag": "Y",  # 중복 허용
            "refKey": ref_key,
            "targetCount": len(targets),
            "targets": targets,
        }

        logging.info(f"📤 SMS 발송 요청: {message_type}, {len(targets)}명")

        try:
            # response 데이터 생성
            response_data = self.make_request(url, None, payload, headers)
            logging.info(f"✅ SMS 발송 성공: {response_data}")

            # messageKey 반환
            message_key = response_data.get("messageKey") if response_data else None
            return message_key is not None

        except Exception as e:
            logging.error(f"❌ SMS 발송 실패: {e}")
            return False
