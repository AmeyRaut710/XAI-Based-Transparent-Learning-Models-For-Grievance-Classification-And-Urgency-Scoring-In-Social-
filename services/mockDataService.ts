import { Source } from '../types';

interface RawData {
  text: string;
  url: string;
}

const SPECIFIC_TEMPLATES: Record<string, string[]> = {
  water: [
    "The water supply in {topic} area has been irregular for weeks.",
    "Dirty and muddy water coming from taps in {topic} region.",
    "We are relying on private tankers because {topic} supply is zero.",
    "The water pressure for {topic} is too low to reach the first floor.",
    "Complained to the Jal Board about {topic} multiple times, no action.",
    "Is anyone else facing severe water logging after the {topic} maintenance?",
    "The quality of drinking water in {topic} is questionable.",
    "Bill for {topic} is huge but there is no supply!",
    "Ground water levels near {topic} are depleting fast.",
    "Please fix the leaking pipe line impacting {topic} immediately."
  ],
  road: [
    "The potholes on the {topic} are causing back pain for commuters.",
    "Traffic congestion on {topic} is a nightmare during peak hours.",
    "Street lights on {topic} have not been working for months.",
    "Why is the {topic} construction taking 5 years to finish?",
    "Dangerous driving conditions on {topic} due to unscientific speed breakers.",
    "The flyover near {topic} has developed cracks.",
    "Water logging on {topic} makes it impossible to drive.",
    "There is no footpath for pedestrians on {topic}.",
    "Encroachment by shops is blocking the {topic} completely.",
    "The toll prices for {topic} are unjustified given the road quality."
  ],
  education: [
    "School fees in {topic} institutions are increasing every year without reason.",
    "The syllabus for {topic} is completely outdated and needs reform.",
    "Government schools regarding {topic} lack basic facilities like toilets.",
    "Pressure on students in the {topic} system is leading to mental health issues.",
    "Teachers in the {topic} department are frequently absent.",
    "Corruption in the {topic} recruitment process is an open secret.",
    "We need more practical learning in {topic} rather than rote memorization.",
    "The entrance exam scam related to {topic} has destroyed students' future.",
    "Universities offering {topic} degrees are not recognized.",
    "Digital infrastructure for {topic} in rural areas is non-existent."
  ],
  bank: [
    "The server for {topic} is down again! Can't make UPI payments.",
    "Hidden charges deducted from my {topic} account without notice.",
    "Rude behavior by the staff at the {topic} branch.",
    "My loan application was rejected by {topic} despite having a good score.",
    "The interest rates for {topic} are too low for savings.",
    "ATM machines of {topic} are always out of cash.",
    "The mobile app for {topic} is buggy and keeps crashing.",
    "KYC process for {topic} is extremely tedious and slow.",
    "Fraudulent transaction on my {topic} card and support is not helping.",
    "Long queues at {topic} just to update a passbook."
  ],
  electricity: [
    "Power cuts in {topic} area are lasting 4-6 hours daily.",
    "Voltage fluctuation in {topic} damaged my appliances.",
    "Electricity bill for {topic} is double what I usually pay!",
    "Live wires hanging dangerously near {topic} pole.",
    "The meter reading for {topic} seems rigged.",
    "No power backup for the {topic} grid failure.",
    "Applying for a new connection for {topic} takes forever.",
    "Street darkness due to {topic} failure is increasing crime.",
    "The transformer for {topic} exploded yesterday.",
    "Why do we pay for {topic} when supply is this bad?"
  ]
};

const CATEGORY_TEMPLATES: Record<string, string[]> = {
  tech: [
    "The battery life of {topic} is disappointing.",
    "Overheating issues with {topic} after the latest update.",
    "Customer support for {topic} is non-existent in India.",
    "Is {topic} worth the high price tag?",
    "The camera quality of {topic} is amazing, but software is buggy.",
    "Screen flickering issue on my new {topic}.",
    "I regret buying {topic}, should have gone for the competitor.",
    "The 5G connectivity on {topic} is very unstable.",
    "Build quality of {topic} feels cheap and plastic.",
    "Best gadget of the year is definitely {topic}."
  ],
  finance: [
    "Market volatility is affecting {topic} heavily.",
    "Taxes on {topic} are killing the middle class.",
    "Is it a good time to invest in {topic}?",
    "The returns on {topic} have dropped significantly.",
    "Crypto regulation regarding {topic} is confusing.",
    "Inflation is making {topic} unaffordable.",
    "My portfolio is down because of {topic} crash.",
    "Avoid trading in {topic}, it's a trap.",
    "The quarterly results for {topic} look promising.",
    "SEBI needs to investigate {topic} manipulation."
  ],
  general: [
    "The situation regarding {topic} is getting worse day by day.",
    "Authorities need to take immediate action on {topic}.",
    "I am frustrated with the management of {topic}.",
    "Does anyone have a solution for the {topic} problem?",
    "The quality of service for {topic} has degraded.",
    "Protesting against the new rules for {topic}.",
    "Why is the media silent about {topic}?",
    "My experience with {topic} in India has been terrible.",
    "We need better laws to regulate {topic}.",
    "Positive development seen in {topic} recently, good job.",
    "Corruption is the root cause of the {topic} failure.",
    "Can we file a PIL regarding {topic}?",
    "Social media is the only place to vent about {topic}.",
    "Safety concerns related to {topic} are being ignored.",
    "The public is suffering because of {topic} negligence."
  ]
};

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const fetchMockComments = async (query: string, source: Source): Promise<RawData[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const lowerQuery = query.toLowerCase();
  
  let templates: string[] = CATEGORY_TEMPLATES.general;
  
  if (lowerQuery.includes('water') || lowerQuery.includes('jal') || lowerQuery.includes('tanker')) {
    templates = SPECIFIC_TEMPLATES.water;
  } else if (lowerQuery.includes('road') || lowerQuery.includes('traffic') || lowerQuery.includes('highway') || lowerQuery.includes('pothole') || lowerQuery.includes('bridge') || lowerQuery.includes('flyover')) {
    templates = SPECIFIC_TEMPLATES.road;
  } else if (lowerQuery.includes('education') || lowerQuery.includes('school') || lowerQuery.includes('college') || lowerQuery.includes('exam') || lowerQuery.includes('university') || lowerQuery.includes('student')) {
    templates = SPECIFIC_TEMPLATES.education;
  } else if (lowerQuery.includes('bank') || lowerQuery.includes('atm') || lowerQuery.includes('loan') || lowerQuery.includes('upi') || lowerQuery.includes('credit card')) {
    templates = SPECIFIC_TEMPLATES.bank;
  } else if (lowerQuery.includes('electricity') || lowerQuery.includes('power') || lowerQuery.includes('voltage') || lowerQuery.includes('bses')) {
    templates = SPECIFIC_TEMPLATES.electricity;
  } else if (lowerQuery.includes('iphone') || lowerQuery.includes('samsung') || lowerQuery.includes('laptop') || lowerQuery.includes('phone') || lowerQuery.includes('tech')) {
    templates = CATEGORY_TEMPLATES.tech;
  } else if (lowerQuery.includes('stock') || lowerQuery.includes('market') || lowerQuery.includes('invest') || lowerQuery.includes('tax') || lowerQuery.includes('economy')) {
    templates = CATEGORY_TEMPLATES.finance;
  }

  const results: RawData[] = [];
  const count = 15;
  const prefixes = {
    YouTube: ["Video: ", "Comment: ", ""],
    Reddit: ["Post: ", "u/User: ", ""],
    Twitter: ["Tweet: ", "@User: ", ""]
  };

  const urls = {
    YouTube: "https://www.youtube.com",
    Reddit: "https://www.reddit.com",
    Twitter: "https://www.twitter.com"
  };

  // Shuffle the pool of templates for this specific request
  const shuffledPool = [...templates].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    // Pick from shuffled pool sequentially or randomly
    const template = shuffledPool[i % shuffledPool.length];
    const formattedTopic = query.charAt(0).toUpperCase() + query.slice(1);
    const text = `${getRandom(prefixes[source])}${template.replace(/{topic}/g, formattedTopic)}`;
    results.push({ text, url: urls[source] });
  }

  // Final shuffle of the results array
  return results.sort(() => Math.random() - 0.5);
};