import os
import chromadb
import google.generativeai as genai

os.environ["ANONYMIZED_TELEMETRY"] = "False"

client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_or_create_collection("resume")


def get_relevant_chunks(question: str, n_results: int = 3) -> list[str]:
    result = genai.embed_content(
        model="models/gemini-embedding-001",
        content=question,
        task_type="retrieval_query",
    )
    matches = collection.query(
        query_embeddings=[result["embedding"]],
        n_results=n_results,
    )
    return matches["documents"][0]
