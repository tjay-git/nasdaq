export enum AnalysisRecommendation {
    BUY = "BUY",
    SELL = "SELL",
    HOLD = "HOLD",
}

export interface StockInfo {
    ticker: string;
    name: string;
    lastClosePrice: number;
}

export interface StockAnalysis {
    recommendation: AnalysisRecommendation;
    reasoning: string;
}

export interface ChartDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface Stock extends StockInfo {
    price: number;
    change: string;
    changePercent: string;
    analysis: StockAnalysis;
    chartData: ChartDataPoint[];
}