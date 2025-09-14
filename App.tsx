
import React, { useState, useEffect, useCallback } from 'react';
import { getTechnicalAnalysis } from './services/geminiService';
import { fetchStockData } from './services/stockDataService';
import { NASDAQ_TOP_25 } from './constants';
import { Stock, StockAnalysis, AnalysisRecommendation, StockInfo } from './types';
import Header from './components/Header';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<Record<string, string>>({});

  const analyzeAllStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const analyzedStocks: Stock[] = [];
    setAnalysisStatus({});
    setStocks([]);
    setSelectedStock(null);

    for (const stockInfo of NASDAQ_TOP_25) {
      try {
        setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Fetching data...' }));
        const chartData = await fetchStockData(stockInfo); // Pass the whole stockInfo object
        
        setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Analyzing with AI...' }));
        const analysis = await getTechnicalAnalysis(stockInfo.ticker, chartData);

        const latestData = chartData[chartData.length - 1];
        
        const newStock: Stock = {
          ...stockInfo,
          price: latestData.close,
          change: (latestData.close - chartData[chartData.length - 2].close).toFixed(2),
          changePercent: (((latestData.close - chartData[chartData.length - 2].close) / chartData[chartData.length - 2].close) * 100).toFixed(2),
          analysis,
          chartData,
        };
        analyzedStocks.push(newStock);
        // Sort immediately to show recommendations as they come in
        const sortedStocks = [...analyzedStocks].sort((a, b) => {
            const order: Record<AnalysisRecommendation, number> = { [AnalysisRecommendation.BUY]: 1, [AnalysisRecommendation.HOLD]: 2, [AnalysisRecommendation.SELL]: 3 };
            return order[a.analysis.recommendation] - order[b.analysis.recommendation];
        });
        setStocks(sortedStocks);
        setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Done' }));

      } catch (e) {
        console.error(`Failed to process ${stockInfo.ticker}:`, e);
        setError(`Failed to analyze ${stockInfo.ticker}. See console for details.`);
        setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Error' }));
      }
    }
    
    if (stocks.length > 0) {
        // Reselect the first stock after the full analysis is complete
        setSelectedStock(stocks[0]);
    }

    setLoading(false);
  }, [stocks]);

  useEffect(() => {
    analyzeAllStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onRefresh={analyzeAllStocks} isRefreshing={loading}/>
      <main className="container mx-auto p-4">
        {loading && stocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader />
            <p className="mt-4 text-lg text-gray-400">Performing Technical Analysis on Fresh Data...</p>
            <div className="mt-4 text-sm text-gray-500 w-full max-w-md bg-gray-800/50 rounded-lg p-4">
              {NASDAQ_TOP_25.map(({ ticker }) => (
                <div key={ticker} className="flex justify-between px-2 py-1">
                  <span className="font-mono">{ticker}</span>
                  <span className={`font-mono ${analysisStatus[ticker] === 'Done' ? 'text-green-400' : analysisStatus[ticker] === 'Error' ? 'text-red-400' : 'text-gray-400'}`}>
                    {analysisStatus[ticker] || 'Pending...'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-4 h-[calc(100vh-120px)] overflow-y-auto pr-2">
              {stocks.map(stock => (
                <StockCard 
                  key={stock.ticker} 
                  stock={stock}
                  isSelected={selectedStock?.ticker === stock.ticker}
                  onSelect={() => setSelectedStock(stock)}
                />
              ))}
            </div>
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow-2xl">
              {selectedStock ? (
                <div>
                  <div className="flex items-baseline gap-4 mb-4">
                    <h2 className="text-4xl font-bold">{selectedStock.ticker}</h2>
                    <p className="text-xl text-gray-400">{selectedStock.name}</p>
                  </div>
                  <div className="h-96 mb-6">
                    <StockChart data={selectedStock.chartData} recommendation={selectedStock.analysis.recommendation} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">AI Technical Analysis</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedStock.analysis.reasoning}</p>
                  </div>
                </div>
              ) : (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Select a stock to view details.</p>
                 </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
