from typing import Optional
from fastapi import APIRouter

router = APIRouter(
    prefix='/manager',
    tags=['manager']
)

@router.post("/upload_to_corpus")
def upload(doc: str, metadata: Optional[str]) -> str:
    return f"Uploaded to Corpus."

@router.post("/delete_from_corpus")
def delete(name: str) -> str:
    return f"Deleted {name} from Corpus."

@router.post("/edit_metadata")
def edit(doc_name: str, new_metadata: str):
    return f"Edited metadata for document: {doc_name}"

