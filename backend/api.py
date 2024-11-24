from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import (
    user,
    manager
)

app = FastAPI()

origins = [
    "http://localhost:3000",  # Adjust based on your frontend address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(user.router)
app.include_router(manager.router)
