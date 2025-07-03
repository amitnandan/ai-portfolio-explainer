// src/components/Charts.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

export default function Charts({ assetData, sectorData }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">💼 Asset Class Allocation</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={assetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {assetData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">🏢 Sector Allocation</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sectorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
