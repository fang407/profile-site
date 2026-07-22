import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
import time
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv
from app.data.resume_chunks import CHUNKS

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_or_create_collection("resume")


def embed(text: str):
    result = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def main():
    for chunk in CHUNKS:
        vector = embed(chunk["text"])
        collection.upsert(
            ids=[chunk["id"]],
            embeddings=[vector],
            documents=[chunk["text"]],
        )
        print(f"Ingested: {chunk['id']}")
        time.sleep(2)
    print(f"Done. {collection.count()} chunks in the collection.")


if __name__ == "__main__":
    main()
