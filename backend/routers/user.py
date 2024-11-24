from typing import Dict
from fastapi import APIRouter

from ..models import SendMessageRequest

router = APIRouter(
    prefix='/user',
    tags=['User']
)

@router.post("/send_message")
def send(request: SendMessageRequest) -> Dict[str, str]:
    return {
        "message": f"Sent message {request.message}"
    }
