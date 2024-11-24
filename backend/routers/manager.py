from typing import Optional, Dict
from fastapi import (
    APIRouter, 
    File,
    UploadFile, 
    HTTPException
)

from ..utils import (
    get_db, 
    get_llm
)

router = APIRouter(
    prefix='/manager',
    tags=['Manager']
)

@router.post("/create")
def create(doc_name: str, file: UploadFile = File(...)) -> Dict[str, str]:
    try:
        contents = file.file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)
    except Exception:
        raise HTTPException(status_code=500, detail='Something went wrong')
    finally:
        file.file.close()

    return {
        "message": f"Successfully uploaded {file.filename}"
    }

@router.post("/delete")
def delete(name: str) -> Dict[str, str]:
    return {
        "message": f"Deleted {name} from Corpus."
    }

@router.post("/update")
def update(doc_name: str, new_metadata: str) -> Dict[str, str]:
    return {
        "message": f"Edited metadata for document: {doc_name}"
    }

