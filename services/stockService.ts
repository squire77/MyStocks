export const getStockPrices = async (symbols: string[]) => {
  try {
    // Alpha Vantage API key - you'll need to replace this with your own key
    const API_KEY = 'GP5I9L24ZQ5NMS3Q';
    const TIMEOUT = 5000; // 5 seconds timeout
    
    // Fetch prices for each symbol with timeout
    const pricePromises = symbols.map(async (symbol) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        console.log(`Response for ${symbol}:`, data); // Debug log
        
        if (!data['Global Quote']) {
          console.error(`No data for ${symbol}:`, data);
          return {
            symbol: symbol,
            price: 0,
            change: 0,
            changePercent: 0
          };
        }

        const quote = data['Global Quote'];
        return {
          symbol: symbol,
          price: parseFloat(quote['05. price'] || '0'),
          change: parseFloat(quote['09. change'] || '0'),
          changePercent: parseFloat((quote['10. change percent'] || '0').replace('%', ''))
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return {
          symbol: symbol,
          price: 0,
          change: 0,
          changePercent: 0
        };
      }
    });

    return await Promise.all(pricePromises);
  } catch (error) {
    console.error('Error in getStockPrices:', error);
    // Return default values for all symbols if the entire request fails
    return symbols.map(symbol => ({
      symbol: symbol,
      price: 0,
      change: 0,
      changePercent: 0
    }));
  }
}; 