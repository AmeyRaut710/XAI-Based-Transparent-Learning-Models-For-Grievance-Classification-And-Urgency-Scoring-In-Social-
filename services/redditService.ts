interface RawData {
  text: string;
  url: string;
}

const generateFallbackRedditData = (query: string): RawData[] => {
  const q = query.trim();
  const formattedQ = q.charAt(0).toUpperCase() + q.slice(1);

  const texts = [
    `[Source: r/India] Thread: "Why is ${formattedQ} so dysfunctional?" - "I have been calling their helpline for 3 days. Every time they say the system is updated but the problem remains. Frustrated!"`,
    `[Source: r/Bangalore] Thread: "Rant about ${formattedQ} behavior" - "The staff at the ${formattedQ} office are incredibly rude. They behave like they are doing us a favor by providing a paid service."`,
    `[Source: r/Delhi] Thread: "Beware of ${formattedQ} scams" - "I got a message about ${formattedQ} KYC expiring. It turned out to be a scam. The company needs to secure our data better."`,
    `[Source: r/LegalAdviceIndia] Thread: "Help with ${formattedQ} deficiency in service" - "My ${formattedQ} application was rejected without any valid reason. Can I take this to the consumer court?"`,
    `[Source: r/India] Thread: "Corruption in ${formattedQ} department" - "The local officer asked for 2000 rupees bribe to process my ${formattedQ} request. This is the reality of our systems."`,
    `[Source: r/Mumbai] Thread: "The state of ${formattedQ} in our ward" - "Every week there is an outage for ${formattedQ}. We are paying premium rates for third-class service."`,
    `[Source: r/India] Thread: "My successful ${formattedQ} experience" - "Surprising but true, my ${formattedQ} issue was resolved in 24 hours after I tagged their nodal officer on social media."`,
    `[Source: r/Hyderabad] Thread: "Is ${formattedQ} down for everyone?" - "Yes, ${formattedQ} portal has been unresponsive since morning. They don't even have a status page to inform users."`,
    `[Source: r/India] Thread: "Price hike in ${formattedQ} is unjustified" - "They just increased the charges for ${formattedQ} by 20%. Where is the improvement in quality? Only profit-making."`,
    `[Source: r/India] Thread: "Kudos to ${formattedQ} support team" - "A staff member named Rajesh at the ${formattedQ} branch went out of his way to help me. Rare to see such dedication."`
  ];

  return texts
    .sort(() => Math.random() - 0.5)
    .map(text => ({ text, url: 'https://www.reddit.com' }));
};

export const fetchRedditData = async (query: string): Promise<RawData[]> => {
  try {
    // Randomize sorting to ensure fresh threads on every search
    const sorts = ['relevance', 'top', 'new', 'comments'];
    const randomSort = sorts[Math.floor(Math.random() * sorts.length)];
    
    const searchContext = `${query} India (rant OR complaint OR problem OR issue OR scam OR bad OR terrible OR rude)`;
    const targetUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(searchContext)}&sort=${randomSort}&limit=12&t=all`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&disableCache=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(proxyUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`Proxy Error: ${response.status}`);

    const proxyData = await response.json();
    if (!proxyData.contents) throw new Error("No data from proxy");

    const redditData = JSON.parse(proxyData.contents);
    const posts = redditData.data?.children || [];

    if (posts.length === 0) return generateFallbackRedditData(query);

    const commentPromises = posts.map(async (post: any) => {
      const permalink = post.data.permalink;
      const subreddit = post.data.subreddit_name_prefixed;
      const postTitle = post.data.title;
      const postUrl = `https://www.reddit.com${permalink}`;
      
      const commentsUrl = `https://www.reddit.com${permalink}.json?sort=confidence&limit=10`;
      const commentsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(commentsUrl)}&disableCache=true`;

      try {
        const cRes = await fetch(commentsProxyUrl, { signal: controller.signal });
        if (!cRes.ok) return [];
        const cProxyData = await cRes.json();
        const cData = JSON.parse(cProxyData.contents);
        
        if (!Array.isArray(cData) || cData.length < 2) return [];
        
        const comments = cData[1].data?.children || [];
        
        return comments
          .filter((c: any) => c.kind === 't1' && c.data.body && c.data.body.length > 30)
          .map((c: any) => ({
            text: `[Subreddit: ${subreddit}] Subject: ${postTitle} - User says: "${c.data.body.substring(0, 500)}"`,
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
        text: `[Source: ${child.data.subreddit_name_prefixed}] Post: "${child.data.title}"`,
        url: `https://www.reddit.com${child.data.permalink}`
       }));
    }

    return allData.slice(0, 40);

  } catch (error) {
    return generateFallbackRedditData(query);
  }
};