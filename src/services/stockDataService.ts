import { ChartDataPoint, StockInfo } from '../types';

const generateRealisticData = (priceRange: [number, number]): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    let price = priceRange[0] + Math.random() * (priceRange[1] - priceRange[0]);
    
    // The original volatility and trend were too high, causing unrealistic price drift over 90 days.
    // These values are now tuned to be more subtle and realistic for large-cap stocks.
    const volatility = 0.015 + Math.random() * 0.02; // Realistic daily volatility (1.5% - 3.5%)
    const trend = (Math.random() - 0.5) * 0.001; // A very subtle daily trend (-0.05% to +0.05%)

    for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (90 - i));
        
        const changePercent = (Math.random() - 0.5) * volatility + trend;
        const open = price;
        const high = Math.max(open, open * (1 + Math.random() * (volatility / 2)));
        const low = Math.min(open, open * (1 - Math.random() * (volatility / 2)));
        const close = open * (1 + changePercent);
        const volume = Math.floor(1_000_000 + Math.random() * 10_000_000);

        data.push({
            date: date.toISOString().split('T')[0],
            open,
            high,
            low,
            close,
            volume,
        });

        price = close;
    }
    return data;
};

export const fetchStockData = (stockInfo: StockInfo): Promise<ChartDataPoint[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const data = generateRealisticData(stockInfo.realisticPriceRange);
            resolve(data);
        }, 500 + Math.random() * 500); 
    });
};