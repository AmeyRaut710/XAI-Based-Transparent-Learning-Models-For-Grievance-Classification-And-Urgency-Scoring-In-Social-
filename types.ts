
export type Source = 'YouTube' | 'Reddit' | 'Twitter';

export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export enum Urgency {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface AnalysisResult {
  id: string;
  originalText: string;
  sentiment: Sentiment;
  category: string;
  urgency: Urgency;
  location: string | null;
  explanation: string;
  source: Source;
  url?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface CategoryData {
  category: string;
  Positive: number;
  Negative: number;
  Neutral: number;
}
