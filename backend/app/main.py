from fastapi import FastAPI

app = FastAPI(title="profile-site-backend")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "backend is alive"}
