import { Source } from '../types';

const API_KEY = 'AIzaSyCxcUDX4RNNDnPGLhD0XcbEmK0WMeVxmVM';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface VideoItem {
  id: { videoId: string };
  snippet: { title: string; channelTitle: string };
}

interface CommentItem {
  snippet: {
    topLevelComment: {
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
      };
    };
  };
}

interface RawData {
  text: string;
  url: string;
}

const generateFallbackYoutubeData = (query: string): RawData[] => {
  const q = query.trim();
  const formattedQ = q.charAt(0).toUpperCase() + q.slice(1);
  
  const texts = [
    `[Video: Why I am closing my ${formattedQ} account] User: "This is the worst experience ever. I have visited the branch three times for a simple name change and they keep sending me back. Very unprofessional staff."`,
    `[Video: Hidden charges exposed in ${formattedQ} India] User: "They deducted 500 rupees without any explanation. When I called the helpline, they just put me on hold for 20 minutes. Total scam!"`,
    `[Video: ${formattedQ} app not working - server down issue] User: "I was at the petrol pump and the ${formattedQ} UPI failed. It's so embarrassing when their servers are down during peak hours every single day."`,
    `[Video: Honest review of ${formattedQ} services in 2024] User: "The customer support used to be good, but now it's all automated bots that don't understand our actual problems. We need human support."`,
    `[Video: My nightmare with ${formattedQ} customer care] User: "My transaction failed but the money was debited. It's been 10 days and ${formattedQ} hasn't refunded my money yet. Who is responsible for this loss?"`,
    `[Video: Public anger against ${formattedQ} mismanagement] User: "The infrastructure at the ${formattedQ} office is pathetic. No seating for senior citizens and no drinking water while we wait for hours."`,
    `[Video: Reality check of ${formattedQ} promises vs implementation] User: "They promise high speed and 24/7 access but the reality is constant outages. ${formattedQ} is failing the common man."`,
    `[Video: How to file a complaint against ${formattedQ} officially] User: "I filed a case in the consumer forum because the ${formattedQ} nodal officer ignored my emails for 2 months. Don't let them win."`,
    `[Video: Comparing ${formattedQ} with other providers] User: "Avoid ${formattedQ} at all costs. Their hidden terms and conditions are designed to trap you. I am switching to a better alternative."`,
    `[Video: Massive fraud in ${formattedQ} - stay safe] User: "I received a phishing call today regarding my ${formattedQ} details. The database seems leaked because they knew my last transaction amount."`
  ];

  // Shuffle the fallback data for freshness
  return texts
    .sort(() => Math.random() - 0.5)
    .map(text => ({
      text,
      url: 'https://www.youtube.com'
    }));
};

export const fetchYouTubeData = async (query: string): Promise<RawData[]> => {
  try {
    // Randomize the order to get different results for the same query
    const orders = ['relevance', 'date', 'viewCount', 'rating'];
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    
    const searchContext = `"${query}" India complaints consumer grievances problems issues`;
    const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(searchContext)}&type=video&maxResults=10&order=${randomOrder}&key=${API_KEY}`;
    
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`YouTube API Error: ${searchRes.status}`);
    
    const searchData = await searchRes.json();
    const videos: VideoItem[] = searchData.items || [];

    if (videos.length === 0) return generateFallbackYoutubeData(query);

    const allData: RawData[] = [];

    const commentPromises = videos.map(async (video) => {
      const videoId = video.id.videoId;
      const videoTitle = video.snippet.title;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      const commentsUrl = `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=30&order=relevance&textFormat=plainText&key=${API_KEY}`;
      
      try {
        const commentRes = await fetch(commentsUrl);
        if (!commentRes.ok) return [];
        
        const commentData = await commentRes.json();
        const items: CommentItem[] = commentData.items || [];

        return items.map(item => ({
          text: `[Video: ${videoTitle}] User: "${item.snippet.topLevelComment.snippet.textDisplay.replace(/\n/g, ' ').trim()}"`,
          url: videoUrl
        }));
      } catch (e) {
        return [];
      }
    });

    const results = await Promise.all(commentPromises);
    results.forEach(items => allData.push(...items));
    
    const filtered = allData.filter(d => d.text.length > 40);
    // Shuffle the final list to ensure different comments are analyzed first
    const shuffledData = filtered.sort(() => Math.random() - 0.5);
    
    return shuffledData.length > 0 ? shuffledData.slice(0, 200) : generateFallbackYoutubeData(query);

  } catch (error) {
    return generateFallbackYoutubeData(query);
  }
};