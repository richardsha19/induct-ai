from typing import Union

from fastapi import FastAPI

from routers import (
    user,
    manager
)

app = FastAPI()

app.include_router(user.router)
app.include_router(manager.router)

@app.get("/")
def read_root():
    return "Hello World"
