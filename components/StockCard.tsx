
import React from 'react';
import { Stock, AnalysisRecommendation } from '../types';

interface StockCardProps {
  stock: Stock;
  isSelected: boolean;
  onSelect: () => void;
}

const RecommendationBadge: React.FC<{ recommendation: AnalysisRecommendation }> = ({ recommendation }) => {
    const baseClasses = "px-3 py-1 text-sm font-bold rounded-full text-white";
    switch (recommendation) {
        case AnalysisRecommendation.BUY:
            return <div className={`${baseClasses} bg-green-500`}>BUY</div>;
        case AnalysisRecommendation.SELL:
            return <div className={`${baseClasses} bg-red-500`}>SELL</div>;
        case AnalysisRecommendation.HOLD:
            return <div className={`${baseClasses} bg-gray-500`}>HOLD</div>;
        default:
            return <div className={`${baseClasses} bg-gray-600`}>N/A</div>;
    }
};

const StockCard: React.FC<StockCardProps> = ({ stock, isSelected, onSelect }) => {
  const isPositive = parseFloat(stock.change) >= 0;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-green-500/20 ring-2 ring-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{stock.ticker}</h3>
          <p className="text-sm text-gray-400 truncate w-48">{stock.name}</p>
        </div>
        <RecommendationBadge recommendation={stock.analysis.recommendation} />
      </div>
      <div className="mt-4 flex justify-between items-end">
        <p className="text-2xl font-semibold">${stock.price.toFixed(2)}</p>
        <div className={`text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <p className="font-medium">{isPositive ? '+' : ''}{stock.change}</p>
          <p className="text-sm">({isPositive ? '+' : ''}{stock.changePercent}%)</p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
