import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint, AnalysisRecommendation } from '../types';

interface StockChartProps {
  data: ChartDataPoint[];
  recommendation: AnalysisRecommendation;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-2 border border-gray-600 rounded">
        <p className="label text-gray-300">{`Date: ${label}`}</p>
        <p className="intro text-green-400">{`Close: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, recommendation }) => {
  const chartColor = recommendation === AnalysisRecommendation.BUY ? "#4ade80" : recommendation === AnalysisRecommendation.SELL ? "#f87171" : "#9ca3af";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
        <YAxis stroke="#9ca3af" domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="close" stroke={chartColor} strokeWidth={2} dot={false} name="Close Price" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
