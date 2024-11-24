from typing import Dict
from fastapi import APIRouter

from ..models import SendMessageRequest

from ..utils import get_db

router = APIRouter(
    prefix='/user',
    tags=['User']
)

@router.post("/send_message")
def send(request: SendMessageRequest) -> Dict[str, str]:
    message_sent = request.message + f" Please note that this user is currently working this job position: {request.position}."

    vector_db = get_db()
    response = vector_db.RAG(
        corpus_path="backend/documents", 
        prompt=message_sent
    )

    return {
        "message": response,
    }
