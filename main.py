# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import openai
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from dotenv import load_dotenv
import os
import io
import uuid

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up ChromaDB
settings = Settings(
    persist_directory=".chroma_db",
    anonymized_telemetry=False
)
chroma_client = chromadb.Client(settings)
embedding_func = embedding_functions.OpenAIEmbeddingFunction(
    api_key=openai.api_key,
    model_name="text-embedding-ada-002"
)
collection = chroma_client.get_or_create_collection("portfolio_memory", embedding_function=embedding_func)

# ========== Models ==========
class AskRequest(BaseModel):
    question: str
    portfolio_id: str

# ========== Routes ==========
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    total_value = df["Value (USD)"].sum()
    asset_class_alloc = df.groupby("Asset Class")["Value (USD)"].sum() / total_value
    sector_alloc = df.groupby("Sector")["Value (USD)"].sum() / total_value
    summary = [
        f"Total portfolio value: ${total_value:,.2f}",
        "Asset Class Allocation:"
    ]
    summary += [f" - {k}: {v:.2%}" for k, v in asset_class_alloc.items()]
    summary.append("Sector Allocation:")
    summary += [f" - {k}: {v:.2%}" for k, v in sector_alloc.items()]
    high_vol = df[df["Volatility (%)"] > 25]
    if not high_vol.empty:
        summary.append("⚠️ High-volatility holdings:")
        for _, row in high_vol.iterrows():
            summary.append(f" - {row['Ticker']} ({row['Volatility (%)']}%)")

    # Unique portfolio ID
    portfolio_id = str(uuid.uuid4())

    # Store embeddings with portfolio ID
    for i, insight in enumerate(summary):
        collection.add(documents=[insight], ids=[f"{portfolio_id}-{i}"], metadatas=[{"portfolio_id": portfolio_id}])

    return {"portfolio_id": portfolio_id, "summary": summary}

@app.post("/ask")
async def ask_question(request: AskRequest):
    print("🔍 Received:", request.question, "| Portfolio:", request.portfolio_id)
    results = collection.query(
        query_texts=[request.question],
        n_results=5,
        where={"portfolio_id": request.portfolio_id}
    )
    print("🔎 Chroma Results:", results)
    context = "\n".join(results["documents"][0]) if results["documents"] else "No context available."
    print("📄 Context for GPT:", context)
    messages = [
        {"role": "system", "content": "You are a financial analyst assistant. Answer the user's question based only on the context."},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {request.question}"}
    ]

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    return {"answer": response.choices[0].message.content}
