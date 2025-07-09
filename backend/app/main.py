import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.alert import router as alert_router
from app.api.glucose import router as glucose_router

load_dotenv()

app = FastAPI(title="Telemed-CGM API", version="0.1.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(glucose_router)
app.include_router(alert_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
