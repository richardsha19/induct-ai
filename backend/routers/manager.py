from typing import Dict
from datetime import datetime
from fastapi import (
    APIRouter, 
    File,
    Form,
    UploadFile, 
    HTTPException
)

from ..utils import (
    get_db, 
    get_llm
)

from ..models import (
    CreateRequest,
    DeleteRequest,
    UpdateRequest
)

import os

router = APIRouter(
    prefix='/manager',
    tags=['Manager']
)

@router.post("/create")
async def create(doc_name: str = Form(...), metadata: str = Form(...), file: UploadFile = File(...)) -> Dict[str, str]:
    documents_folder = "backend/documents"

    # Ensure the "documents" folder exists
    if not os.path.exists(documents_folder):
        os.makedirs(documents_folder)

    try:
        # Read file contents
        contents = file.file.read()

        # Define the file path within the "documents" folder
        file_path = os.path.join(documents_folder, file.filename)

        # Save the file
        with open(file_path, 'wb') as f:
            f.write(contents)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")
    finally:
        file.file.close()

    return {
        "message": f"Successfully uploaded {file.filename} with doc_name: {doc_name}",
        "name": doc_name,
        "uploadDate": datetime.today().strftime('%Y-%m-%d'),
        "metadata": metadata
    }

# Request model for the delete endpoint
@router.post("/delete")
def delete(request: DeleteRequest) -> Dict[str, str]:
    return {
        "message": f"Deleted {request.name} from Corpus."
    }

@router.post("/update")
def update(request: UpdateRequest) -> Dict[str, str]:
    return {
        "message": f"Edited metadata for document: {request.doc_name}"
    }
