# 📊 AI Portfolio Explainer

An AI-powered tool to analyze investment portfolios, highlight risks, and answer natural language questions using GPT.

---

## 🔧 Tech Stack

* **Frontend:** React + Tailwind + Recharts
* **Backend:** FastAPI + ChromaDB + OpenAI API

---

## ⚙️ Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Add `.env`:

```
OPENAI_API_KEY=your-key
```

### Frontend

```bash
cd frontend/ai-portfolio-ui
npm install
npm run dev
```

---

## 📂 CSV Format

```
Ticker,Asset Class,Sector,Value (USD),Volatility (%)
AAPL,Equity,Technology,50000,22.5
```

---

## 💬 Sample Questions

* What is the equity allocation?
* Are there any high-volatility holdings?

---

## 📝 License

MIT
