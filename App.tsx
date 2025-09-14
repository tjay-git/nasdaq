import React, { useState, useEffect, useCallback } from 'react';
import { getTechnicalAnalysis } from './services/geminiService';
import { fetchStockData } from './services/stockDataService';
import { NASDAQ_TOP_25 } from './constants';
import { Stock, AnalysisRecommendation } from './types';
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
    setStocks([]);
    setSelectedStock(null);
    setAnalysisStatus(
      Object.fromEntries(NASDAQ_TOP_25.map(s => [s.ticker, 'Pending...']))
    );

    const analysisPromises = NASDAQ_TOP_25.map(stockInfo =>
      (async () => {
        try {
          setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Fetching data...' }));
          const chartData = await fetchStockData(stockInfo);

          setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Analyzing...' }));
          const analysis = await getTechnicalAnalysis(stockInfo.ticker, chartData);

          const latestData = chartData[chartData.length - 1];
          const prevData = chartData[chartData.length - 2];
          
          const newStock: Stock = {
            ...stockInfo,
            price: latestData.close,
            change: (latestData.close - prevData.close).toFixed(2),
            changePercent: (((latestData.close - prevData.close) / prevData.close) * 100).toFixed(2),
            analysis,
            chartData,
          };

          setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Done' }));
          return newStock;
        } catch (e) {
          console.error(`Failed to process ${stockInfo.ticker}:`, e);
          setAnalysisStatus(prev => ({ ...prev, [stockInfo.ticker]: 'Error' }));
          return null; // Return null on error
        }
      })()
    );

    const results = await Promise.all(analysisPromises);
    const successfulStocks = results.filter((stock): stock is Stock => stock !== null);

    if (successfulStocks.length < NASDAQ_TOP_25.length) {
        setError("Could not analyze all stocks. Some data may be missing.");
    }

    const sortedStocks = successfulStocks.sort((a, b) => {
        const order: Record<AnalysisRecommendation, number> = { [AnalysisRecommendation.BUY]: 1, [AnalysisRecommendation.HOLD]: 2, [AnalysisRecommendation.SELL]: 3 };
        return order[a.analysis.recommendation] - order[b.analysis.recommendation];
    });

    setStocks(sortedStocks);
    if (sortedStocks.length > 0) {
        setSelectedStock(sortedStocks[0]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    analyzeAllStocks();
  }, [analyzeAllStocks]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onRefresh={analyzeAllStocks} isRefreshing={loading}/>
      <main className="container mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader />
            <p className="mt-4 text-lg text-gray-400">Performing Parallel Technical Analysis...</p>
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
        ) : error && stocks.length === 0 ? (
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
