from typing import Optional
from fastapi import APIRouter

router = APIRouter(
    prefix='/manager',
    tags=['Manager']
)

@router.post("/create")
def create(doc: str, metadata: Optional[str]) -> str:
    return f"Uploaded to Corpus."

@router.post("/delete")
def delete(name: str) -> str:
    return f"Deleted {name} from Corpus."

@router.post("/update")
def update(doc_name: str, new_metadata: str):
    return f"Edited metadata for document: {doc_name}"

