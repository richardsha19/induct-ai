from fastapi import APIRouter

router = APIRouter(
    prefix='/user',
    tags=['User']
)

@router.post("/send_message")
def send(msg: str):
    return f"Sent message {msg}"
