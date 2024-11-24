from pydantic import BaseModel

class DeleteRequest(BaseModel):
    name: str

class CreateRequest(BaseModel):
    doc_name: str

class UpdateRequest(BaseModel):
    doc_name: str
    new_metadata: str