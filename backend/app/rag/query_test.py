import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_collection("resume")

question = "What AWS certifications does she have?"

result = genai.embed_content(
    model="models/gemini-embedding-001",
    content=question,
    task_type="retrieval_query",
)

matches = collection.query(query_embeddings=[result["embedding"]], n_results=2)

print(f"Question: {question}\n")
for doc, dist in zip(matches["documents"][0], matches["distances"][0]):
    print(f"(distance {dist:.3f}) {doc}\n")
