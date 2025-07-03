// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import Upload from "./components/Upload";
import Charts from "./components/Charts";
import ChatBox from "./components/ChatBox.jsx";

export default function App() {
  const [summary, setSummary] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [portfolioId, setPortfolioId] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    const res = await axios.post("http://localhost:8000/analyze", formData);
    setSummary(res.data.summary);
    setPortfolioId(res.data.portfolio_id);
    console.log("📦 Portfolio ID received:", res.data.portfolio_id);

    const assetStart = res.data.summary.indexOf("Asset Class Allocation:") + 1;
    const sectorStart = res.data.summary.indexOf("Sector Allocation:") + 1;

    const assetLines = [];
    for (let i = assetStart; i < res.data.summary.length; i++) {
      if (!res.data.summary[i].startsWith(" - ")) break;
      assetLines.push(res.data.summary[i]);
    }

    const sectorLines = [];
    for (let i = sectorStart; i < res.data.summary.length; i++) {
      if (!res.data.summary[i].startsWith(" - ")) break;
      sectorLines.push(res.data.summary[i]);
    }

    setAssetData(
      assetLines.map((line) => {
        const [label, value] = line.replace(" - ", "").split(": ");
        return { name: label, value: parseFloat(value.replace("%", "")) };
      })
    );

    setSectorData(
      sectorLines.map((line) => {
        const [label, value] = line.replace(" - ", "").split(": ");
        return { name: label, value: parseFloat(value.replace("%", "")) };
      })
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📊 AI Portfolio Explainer</h1>
      <Upload onUpload={handleUpload} />
      {loading && <p className="text-gray-600 mt-4">Analyzing portfolio...</p>}
      {summary.length > 0 && (
        <>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">📝 Portfolio Summary</h2>
            <ul className="list-disc list-inside">
              {summary.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
          <Charts assetData={assetData} sectorData={sectorData} />
          <ChatBox portfolioId={portfolioId} />
        </>
      )}
    </div>
  );
}