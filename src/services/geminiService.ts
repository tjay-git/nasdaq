import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis, ChartDataPoint, AnalysisRecommendation } from '../types';

const getGeminiApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
  }
  return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    recommendation: {
      type: Type.STRING,
      enum: [AnalysisRecommendation.BUY, AnalysisRecommendation.SELL, AnalysisRecommendation.HOLD],
      description: "Your final recommendation based on the analysis."
    },
    reasoning: {
      type: Type.STRING,
      description: "A concise, one-paragraph summary of your technical analysis, including key indicators, patterns, support/resistance levels, and the primary reasons for your recommendation."
    },
  },
  required: ['recommendation', 'reasoning']
};

export const getTechnicalAnalysis = async (ticker: string, data: ChartDataPoint[]): Promise<StockAnalysis> => {
  const prompt = `
    Analyze the provided daily stock data for ${ticker}. The data includes date, open, high, low, close, and volume for the last 90 days.
    
    Perform a thorough technical analysis focusing on:
    1.  **Trend Analysis:** Identify the primary, secondary, and short-term trends.
    2.  **Chart Patterns:** Look for significant patterns (e.g., head and shoulders, double tops/bottoms, triangles, flags).
    3.  **Moving Averages:** Analyze crossovers and positioning of key moving averages (e.g., 20-day, 50-day).
    4.  **Momentum Indicators:** Assess momentum using RSI (Relative Strength Index) to identify overbought/oversold conditions.
    5.  **Support and Resistance:** Identify key price levels that act as support and resistance.
    6.  **Volume Analysis:** Correlate price movements with trading volume to confirm trends.

    Based on your comprehensive analysis of these factors, provide a clear 'BUY', 'SELL', or 'HOLD' recommendation for today. Also, provide a concise, one-paragraph summary explaining your reasoning.

    Stock Data:
    ${JSON.stringify(data)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.3,
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (Object.values(AnalysisRecommendation).includes(parsedJson.recommendation) && typeof parsedJson.reasoning === 'string') {
        return parsedJson as StockAnalysis;
    } else {
        throw new Error("Received invalid JSON structure from API.");
    }

  } catch (error) {
    console.error("Error getting technical analysis from Gemini:", error);
    return {
      recommendation: AnalysisRecommendation.HOLD,
      reasoning: "Could not retrieve analysis due to an API error. Defaulting to HOLD. Please check console for more details."
    };
  }
};
