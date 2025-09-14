import { StockInfo } from './types';

// Data updated to reflect approximate closing prices from the last trading day.
// This provides a realistic anchor for the data simulation.
export const NASDAQ_TOP_25: StockInfo[] = [
  { ticker: 'MSFT', name: 'Microsoft Corporation', lastClosePrice: 445.70 },
  { ticker: 'AAPL', name: 'Apple Inc.', lastClosePrice: 214.29 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', lastClosePrice: 131.88 },
  { ticker: 'GOOGL', name: 'Alphabet Inc. Class A', lastClosePrice: 179.63 },
  { ticker: 'GOOG', name: 'Alphabet Inc. Class C', lastClosePrice: 181.38 },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', lastClosePrice: 183.83 },
  { ticker: 'META', name: 'Meta Platforms, Inc.', lastClosePrice: 494.89 },
  { ticker: 'AVGO', name: 'Broadcom Inc.', lastClosePrice: 1734.56 },
  { ticker: 'TSLA', name: 'Tesla, Inc.', lastClosePrice: 183.01 },
  { ticker: 'COST', name: 'Costco Wholesale Corporation', lastClosePrice: 848.31 },
  { ticker: 'AMD', name: 'Advanced Micro Devices, Inc.', lastClosePrice: 161.78 },
  { ticker: 'NFLX', name: 'Netflix, Inc.', lastClosePrice: 669.02 },
  { ticker: 'PEP', name: 'PepsiCo, Inc.', lastClosePrice: 168.04 },
  { ticker: 'ADBE', name: 'Adobe Inc.', lastClosePrice: 525.13 },
  { ticker: 'LIN', name: 'Linde plc', lastClosePrice: 442.98 },
  { ticker: 'CSCO', name: 'Cisco Systems, Inc.', lastClosePrice: 47.38 },
  { ticker: 'TMUS', name: 'T-Mobile US, Inc.', lastClosePrice: 178.50 },
  { ticker: 'INTC', name: 'Intel Corporation', lastClosePrice: 30.64 },
  { ticker: 'QCOM', name: 'QUALCOMM, Incorporated', lastClosePrice: 215.48 },
  { ticker: 'CMCSA', name: 'Comcast Corporation', lastClosePrice: 38.49 },
  { ticker: 'INTU', name: 'Intuit Inc.', lastClosePrice: 620.40 },
  { ticker: 'AMAT', name: 'Applied Materials, Inc.', lastClosePrice: 236.44 },
  { ticker: 'TXN', name: 'Texas Instruments Incorporated', lastClosePrice: 196.17 },
  { ticker: 'ISRG', name: 'Intuitive Surgical, Inc.', lastClosePrice: 435.00 },
  { ticker: 'AMGN', name: 'Amgen Inc.', lastClosePrice: 318.06 }
];
