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
    documents_folder = "backend/documents"
    file_path = os.path.join(documents_folder, request.name)
    metadata_path = os.path.join(documents_folder, f"{request.name}_metadata.txt")
    
    try:
        vector_db = get_db()
        # delete the file called request.name in the backend/documents folder
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists(metadata_path):
            os.remove(metadata_path)
        vector_db.delete_document(request.name)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")
    return {
        "message": f"Deleted {request.name} from Documents."
    }

@router.post("/update")
def update(request: UpdateRequest) -> Dict[str, str]:
    vector_db = get_db()
    documents_folder = "backend/documents"
    metadata_path = os.path.join(documents_folder, f"{request.doc_name}_metadata.txt")

    try:
        # Update the metadata file
        with open(metadata_path, 'w') as f:
            f.write(request.new_metadata)

        # Update document in VectorDB
        document_content = vector_db.parse_docs(documents_folder)
        vector_db.add_embeddings(document_content)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to update document metadata")

    return {
        "message": f"Edited metadata for document: {request.doc_name}"
    }
