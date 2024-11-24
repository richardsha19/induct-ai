from model.db import VectorDB
from model.llm import LLMManager

db = VectorDB()
llm = LLMManager()

def get_db() -> VectorDB:
    return db

def get_llm() -> LLMManager:
    return llm
