import { AnalysisResult, Sentiment, Urgency, Source } from "../types";

interface RawData {
  text: string;
  url: string;
}

export const analyzeComments = async (
  items: RawData[],
  source: Source,
  query: string
): Promise<AnalysisResult[]> => {
  if (items.length === 0) return [];

  // Simulate small delay for processing
  await new Promise(resolve => setTimeout(resolve, 500));

  const highUrgencyWords = ['scam', 'fraud', 'lost', 'crash', 'failed', 'down', 'worst', 'stuck', 'terrible', 'pathetic', 'emergency', 'debited', 'stolen', 'unresponsive', 'phishing', 'hacked', 'error', 'scammed'];
  const mediumUrgencyWords = ['rude', 'waiting', 'delayed', 'slow', 'unprofessional', 'frustrated', 'bad', 'issue', 'problem', 'rant', 'disappointed'];
  const positiveWords = ['good', 'great', 'kudos', 'best', 'successful', 'thanks', 'amazing', 'happy', 'resolved', 'helpful'];

  const categoryMap: { [key: string]: string[] } = {
    'UPI/Payments': ['upi', 'payment', 'transaction', 'debited', 'money', 'refund'],
    'Customer Care/Staff': ['support', 'care', 'helpline', 'staff', 'officer', 'branch', 'manager'],
    'Service/Infrastructure': ['slow', 'server', 'down', 'outage', 'speed', 'app', 'portal', 'infrastructure', 'network'],
    'Fees/Charges': ['charge', 'deducted', 'rupees', 'price', 'hike', 'fee', 'premium'],
    'Account/KYC': ['kyc', 'account', 'name change', 'update', 'login', 'password']
  };

  const cities = ['mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur'];

  return items.map((item, index) => {
    const textLower = item.text.toLowerCase();
    
    // Determine Urgency and Sentiment
    let urgency = Urgency.Low;
    let sentiment = Sentiment.Neutral;
    
    const hasHigh = highUrgencyWords.some(w => textLower.includes(w));
    const hasMedium = mediumUrgencyWords.some(w => textLower.includes(w));
    const hasPositive = positiveWords.some(w => textLower.includes(w));

    if (hasHigh) {
      urgency = Urgency.High;
      sentiment = Sentiment.Negative;
    } else if (hasMedium) {
      urgency = Urgency.Medium;
      sentiment = Sentiment.Negative;
    } else if (hasPositive) {
      urgency = Urgency.Low;
      sentiment = Sentiment.Positive;
    }

    // Determine Category
    let category = 'General Grievance';
    for (const [cat, words] of Object.entries(categoryMap)) {
      if (words.some(w => textLower.includes(w))) {
        category = cat;
        break;
      }
    }

    // Determine Location
    let location = 'India';
    for (const city of cities) {
      if (textLower.includes(city)) {
        location = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }

    // Generate Explanation
    let explanation = `This comment expresses a ${sentiment.toLowerCase()} sentiment regarding ${category.toLowerCase()}.`;
    if (urgency === Urgency.High) {
      explanation = `Requires immediate attention due to mentions of critical issues like failure, fraud, or significant loss related to ${category}.`;
    } else if (sentiment === Sentiment.Positive) {
      explanation = `Positive feedback regarding the service or staff.`;
    }

    return {
      id: `analysis-${Date.now()}-${index}`,
      originalText: item.text,
      sentiment,
      category,
      urgency,
      location,
      explanation,
      source,
      url: item.url
    };
  });
};
