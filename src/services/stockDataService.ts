import { ChartDataPoint, StockInfo } from '../types';

/**
 * Generates a plausible 90-day stock history ending at the provided `lastClose` price.
 * This function works backwards from a real data point to create a realistic simulation.
 * @param lastClose The final closing price, used as an anchor (e.g., yesterday's actual close).
 * @returns An array of 90 chronologically sorted data points.
 */
const generateRealisticData = (lastClose: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    let price = lastClose; // Start from the most recent, real price
    const volatility = 0.015 + Math.random() * 0.02; // Daily volatility (1.5% - 3.5%)

    // Generate today's data point first, anchored to the last close
    const today = new Date();
    const openToday = price * (1 + (Math.random() - 0.5) * (volatility / 2));
    const highToday = Math.max(openToday, price) * (1 + Math.random() * (volatility / 4));
    const lowToday = Math.min(openToday, price) * (1 - Math.random() * (volatility / 4));
    
    data.push({
        date: today.toISOString().split('T')[0],
        open: openToday,
        high: highToday,
        low: lowToday,
        close: price,
        volume: Math.floor(1_000_000 + Math.random() * 10_000_000),
    });

    // Generate the previous 89 days of historical data by working backwards
    for (let i = 1; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // To find the previous day's close, we apply a reverse random change
        const reverseChangePercent = 1 + (Math.random() - 0.5) * volatility;
        const prevClose = price / reverseChangePercent;

        const open = prevClose * (1 + (Math.random() - 0.5) * (volatility / 2));
        const high = Math.max(open, prevClose) * (1 + Math.random() * (volatility / 4));
        const low = Math.min(open, prevClose) * (1 - Math.random() * (volatility / 4));

        data.push({
            date: date.toISOString().split('T')[0],
            open,
            high,
            low,
            close: prevClose,
            volume: Math.floor(1_000_000 + Math.random() * 10_000_000),
        });

        price = prevClose; // Move our reference price to the previous day
    }

    // The data was generated backwards, so we must reverse it to be chronological for the chart
    return data.reverse();
};

// Simulate network latency and fetch data
export const fetchStockData = (stockInfo: StockInfo): Promise<ChartDataPoint[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const data = generateRealisticData(stockInfo.lastClosePrice);
            resolve(data);
        }, 500 + Math.random() * 500); 
    });
};