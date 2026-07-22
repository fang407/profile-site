import os
import google.generativeai as genai
from dotenv import load_dotenv
from app.rag.retrieve import get_relevant_chunks

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

with open("app/prompts/ask_me_system.md") as f:
    SYSTEM_PROMPT = f.read()

model = genai.GenerativeModel(
    model_name="models/gemini-flash-latest",
    system_instruction=SYSTEM_PROMPT,
)


def answer_question(question: str) -> str:
    chunks = get_relevant_chunks(question)
    context = "\n\n".join(chunks)

    prompt = f"Context:\n{context}\n\nQuestion: {question}"
    response = model.generate_content(prompt)
    return response.text
