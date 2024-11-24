from fastapi import FastAPI

from model.db import VectorDB
from model.llm import LLMManager

from routers import (
    user,
    manager
)

db = VectorDB()
llm = LLMManager()

def get_db() -> VectorDB:
    return db

def get_llm() -> LLMManager:
    return llm

app = FastAPI()

app.include_router(user.router)
app.include_router(manager.router)
