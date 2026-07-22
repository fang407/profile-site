import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.rag.chat import answer_question
from google.api_core.exceptions import ResourceExhausted

logger = logging.getLogger("uvicorn.error")

class ChatRequest(BaseModel):
    message: str

app = FastAPI(title="profile-site-backend")

@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        answer = answer_question(request.message)
    except ResourceExhausted:
        logger.warning("Gemini rate limit hit for a chat request")
        raise HTTPException(
            status_code=503,
            detail="The assistant is a bit busy right now — please try again in a minute.",
        )
    except Exception:
        logger.exception("Unexpected error answering a chat question")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong answering that. Please try again.",
        )
    return {"answer": answer}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "backend is alive"}
