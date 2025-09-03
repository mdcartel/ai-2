// Universal live data fetching utilities
export interface LiveDataResponse {
  shouldUseLiveData: boolean;
  data?: string;
  error?: string;
}

// Keywords that indicate current/live information is needed
const CURRENT_INFO_KEYWORDS = [
  'latest', 'current', 'newest', 'recent', 'today', 'now', 'this year', '2025',
  'up to date', 'updated', 'modern', 'contemporary'
];

// Check if a message needs live data
export function needsLiveData(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CURRENT_INFO_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

// Enhanced web search function
async function searchWeb(query: string): Promise<string> {
  try {
    // Use DuckDuckGo Instant Answer API for quick facts
    const duckDuckGoUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    
    const response = await fetch(duckDuckGoUrl);
    const data = await response.json();
    
    if (data.AbstractText) {
      return data.AbstractText;
    }
    
    if (data.Answer) {
      return data.Answer;
    }
    
    if (data.Definition) {
      return data.Definition;
    }
    
    // If no direct answer, try to get info from related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const firstTopic = data.RelatedTopics[0];
      if (firstTopic.Text) {
        return firstTopic.Text;
      }
    }
    
    throw new Error('No current information found');
  } catch (error) {
    throw new Error('Unable to fetch current information');
  }
}

// Fetch specific technology versions
async function fetchTechVersions(tech: string): Promise<string> {
  try {
    const techMap: { [key: string]: string } = {
      'nodejs': 'https://nodejs.org/dist/index.json',
      'node': 'https://nodejs.org/dist/index.json',
      'react': 'https://api.github.com/repos/facebook/react/releases/latest',
      'vue': 'https://api.github.com/repos/vuejs/vue/releases/latest',
      'angular': 'https://api.github.com/repos/angular/angular/releases/latest',
      'typescript': 'https://api.github.com/repos/microsoft/TypeScript/releases/latest',
      'nextjs': 'https://api.github.com/repos/vercel/next.js/releases/latest',
      'svelte': 'https://api.github.com/repos/sveltejs/svelte/releases/latest'
    };
    
    const url = techMap[tech.toLowerCase()];
    if (!url) throw new Error('Technology not supported');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (url.includes('nodejs.org')) {
      const latest = data[0];
      return `The latest Node.js version is ${latest.version} (released ${new Date(latest.date).toLocaleDateString()}).`;
    } else {
      return `The latest ${tech} version is ${data.tag_name} (released ${new Date(data.published_at).toLocaleDateString()}).`;
    }
  } catch (error) {
    throw new Error(`Failed to fetch ${tech} version data`);
  }
}

// Main function to get live data based on query
export async function getLiveData(message: string): Promise<LiveDataResponse> {
  if (!needsLiveData(message)) {
    return { shouldUseLiveData: false };
  }

  try {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific technology versions
    const techKeywords = ['nodejs', 'node', 'react', 'vue', 'angular', 'typescript', 'nextjs', 'svelte'];
    const foundTech = techKeywords.find(tech => lowerMessage.includes(tech));
    
    if (foundTech && (lowerMessage.includes('version') || lowerMessage.includes('latest'))) {
      const data = await fetchTechVersions(foundTech);
      return { shouldUseLiveData: true, data };
    }
    
    // For general current information queries, use web search
    const data = await searchWeb(message);
    return { shouldUseLiveData: true, data };
    
  } catch (error) {
    return { 
      shouldUseLiveData: true, 
      error: 'Unable to fetch current information. The AI will provide its best knowledge, but it may not be up to date.' 
    };
  }
}