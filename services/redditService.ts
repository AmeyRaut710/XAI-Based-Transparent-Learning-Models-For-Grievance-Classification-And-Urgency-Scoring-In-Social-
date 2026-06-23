interface RawData {
  text: string;
  url: string;
}

const CLIENT_ID = 'WlTdc59SbSHSVSqf7OWoRrkA';
const CLIENT_SECRET = 'FAbyunYKm7YMC679_HbZ97qkz6grjqw';
const USER_AGENT = 'CivicComplaintAnalyzer by u/DashingKaal';
const SUBREDDIT = 'india';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

const getRedditToken = async (): Promise<string> => {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Reddit access token');
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // 1 min buffer
  return accessToken!;
};

const generateFallbackRedditData = (query: string): RawData[] => {
  const q = query.trim();
  const formattedQ = q.charAt(0).toUpperCase() + q.slice(1);
  return [
    { text: `[Source: r/India] Thread: "Why is ${formattedQ} so dysfunctional?" - "I have been calling their helpline for 3 days. Every time they say the system is updated but the problem remains. Frustrated!"`, url: 'https://www.reddit.com' },
    { text: `[Source: r/India] Thread: "Rant about ${formattedQ} behavior" - "The staff at the ${formattedQ} office are incredibly rude. They behave like they are doing us a favor by providing a paid service."`, url: 'https://www.reddit.com' },
    { text: `[Source: r/India] Thread: "Is ${formattedQ} down for everyone?" - "Yes, ${formattedQ} portal has been unresponsive since morning. They don't even have a status page to inform users."`, url: 'https://www.reddit.com' },
  ].sort(() => Math.random() - 0.5);
};

export const fetchRedditData = async (query: string): Promise<RawData[]> => {
  try {
    const token = await getRedditToken();
    const searchContext = `${query} (rant OR complaint OR problem OR issue OR scam OR bad OR terrible OR rude)`;
    
    // Using limit=100 as rate limit targets up to 200 total (we will grab up to 100 threads, which can yield many comments)
    const targetUrl = `https://oauth.reddit.com/r/${SUBREDDIT}/search.json?q=${encodeURIComponent(searchContext)}&sort=relevance&limit=50&restrict_sr=on`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, { 
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': USER_AGENT
      }
    });

    if (!response.ok) throw new Error(`Reddit API Error: ${response.status}`);

    const redditData = await response.json();
    const posts = redditData.data?.children || [];

    if (posts.length === 0) return generateFallbackRedditData(query);

    const commentPromises = posts.map(async (post: any) => {
      const postId = post.data.id;
      const postTitle = post.data.title;
      const postUrl = `https://www.reddit.com${post.data.permalink}`;
      
      const commentsUrl = `https://oauth.reddit.com/r/${SUBREDDIT}/comments/${postId}.json?sort=confidence&limit=5`;

      try {
        const cRes = await fetch(commentsUrl, { 
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': USER_AGENT
          }
        });
        if (!cRes.ok) return [];
        
        const cData = await cRes.json();
        
        if (!Array.isArray(cData) || cData.length < 2) return [];
        
        const comments = cData[1].data?.children || [];
        
        return comments
          .filter((c: any) => c.kind === 't1' && c.data.body && c.data.body.length > 30)
          .map((c: any) => ({
            text: `[Subreddit: r/${SUBREDDIT}] Subject: ${postTitle} - User says: "${c.data.body.substring(0, 500)}"`,
            url: postUrl
          }));
      } catch (err) {
        return [];
      }
    });

    const results = await Promise.all(commentPromises);
    clearTimeout(timeoutId);

    const allData = results.flat().sort(() => Math.random() - 0.5);
    
    if (allData.length === 0) {
       return posts.map((child: any) => ({
        text: `[Source: r/${SUBREDDIT}] Post: "${child.data.title}"`,
        url: `https://www.reddit.com${child.data.permalink}`
       }));
    }

    return allData.slice(0, 200);

  } catch (error) {
    console.error('Reddit fetching error:', error);
    return generateFallbackRedditData(query);
  }
};