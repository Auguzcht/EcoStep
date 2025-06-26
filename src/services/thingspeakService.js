/**
 * ThingSpeak API service for EcoStep energy harvesting data
 * Connects to ThingSpeak IoT platform to fetch data from Arduino ESP8266
 */

const CHANNEL_ID = import.meta.env.VITE_APP_THINGSPEAK_CHANNEL_ID || "2995641";
const READ_API_KEY = import.meta.env.VITE_APP_THINGSPEAK_READ_API_KEY || "JAEGUGJX3K7ICOHQ";

/**
 * Fetch the latest data from ThingSpeak channel
 * @param {number} results - Number of results to return (default: 10)
 * @returns {Promise} - Promise with channel data
 */
export const fetchLatestData = async (results = 10) => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=${results}`
    );
    
    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching ThingSpeak data:", error);
    throw error;
  }
};

/**
 * Fetch data for a specific field from ThingSpeak channel
 * @param {number} fieldNumber - Field number to fetch (1-5)
 * @param {number} results - Number of results to return (default: 24)
 * @returns {Promise} - Promise with field data
 */
export const fetchFieldData = async (fieldNumber, results = 24) => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/${fieldNumber}.json?api_key=${READ_API_KEY}&results=${results}`
    );
    
    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching field ${fieldNumber} data:`, error);
    throw error;
  }
};

/**
 * Transform ThingSpeak data into format suitable for charts
 * @param {Object} data - ThingSpeak API response
 * @param {string} fieldName - Field to extract (field1, field2, etc.)
 * @returns {Array} - Formatted data for charts
 */
export const formatChartData = (data, fieldName) => {
  if (!data || !data.feeds) return [];
  
  return data.feeds.map(entry => ({
    x: new Date(entry.created_at).toLocaleString(),
    y: parseFloat(entry[fieldName]) || 0
  }));
};

/**
 * Format ThingSpeak data for line charts with appropriate labels
 * @param {Object} data - ThingSpeak API response
 * @param {string} fieldName - Field to extract (field1, field2, etc.)
 * @param {string} label - Label for the data series
 * @returns {Array} - Formatted data for Nivo line charts
 */
export const formatLineChartData = (data, fieldName, label) => {
  if (!data || !data.feeds) return [];
  
  const formattedData = data.feeds.map(entry => ({
    x: new Date(entry.created_at).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    y: parseFloat(entry[fieldName]) || 0
  }));
  
  return [{
    id: label,
    data: formattedData
  }];
};

/**
 * Get the latest values for all fields
 * @param {Object} data - ThingSpeak API response
 * @returns {Object} - Latest values for all fields
 */
export const getLatestValues = (data) => {
  if (!data || !data.feeds || !data.feeds.length) {
    return {
      voltage: 0,
      events: 0,
      temperature: 0,
      humidity: 0,
      light: 0,
      timestamp: new Date().toLocaleString()
    };
  }
  
  const latestFeed = data.feeds[data.feeds.length - 1];
  
  return {
    voltage: parseFloat(latestFeed.field1) || 0,
    events: parseInt(latestFeed.field2) || 0,
    temperature: parseFloat(latestFeed.field3) || 0,
    humidity: parseFloat(latestFeed.field4) || 0,
    light: parseInt(latestFeed.field5) || 0,
    timestamp: new Date(latestFeed.created_at).toLocaleString()
  };
};