from fastapi import APIRouter

router = APIRouter(
    prefix='/user',
    tags=['users']
)

@router.get("/name")
def get_name(request_id: int):
    return f"User with ID {request_id} is named Rehan."
