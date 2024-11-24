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
    vector_db = get_db()
    response = vector_db.RAG(
        corpus_path="backend/documents", 
        prompt=request.message
    )

    return {
        "message": response,
    }
