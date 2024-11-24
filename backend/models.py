from pydantic import BaseModel

class DeleteRequest(BaseModel):
    name: str

class UpdateRequest(BaseModel):
    doc_name: str
    new_metadata: str

class SendMessageRequest(BaseModel):
    message: str
    position: str
