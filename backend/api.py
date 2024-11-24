from fastapi import FastAPI

from .routers import (
    user,
    manager
)

app = FastAPI()

app.include_router(user.router)
app.include_router(manager.router)
