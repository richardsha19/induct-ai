from pydantic import BaseModel

class DeleteRequest(BaseModel):
    name: str

